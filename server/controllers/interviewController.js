 const Interview = require("../models/Interview");
const {
  generateQuestions,
  evaluateAnswer,
} = require("../services/geminiService");

// ======================
// Create Interview
// ======================
const createInterview = async (req, res) => {
  try {
    const { jobRole, experience, difficulty } = req.body;

    if (!jobRole) {
      return res.status(400).json({
        success: false,
        message: "Job role is required",
      });
    }

    let aiResponse = await generateQuestions(
      jobRole,
      experience,
      difficulty
    );

    aiResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

   let questions;

try {
  questions = JSON.parse(aiResponse);
} catch (err) {
  return res.status(500).json({
    success: false,
    message: "AI response format invalid",
  });
}

    const interview = await Interview.create({
      user: req.user.id,
      jobRole,
      experience,
      difficulty,
      questions,
    });

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Get Single Interview
// ======================
const getInterview = async (req, res) => {
  try {
     const interview = await Interview.findOne({
  _id: req.params.id,
  user: req.user.id,
});

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Submit Answer + AI Evaluation
// ======================
const submitAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const question = interview.questions.id(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Save candidate answer
    question.answer = answer;

    // Evaluate using Gemini
    let aiResponse = await evaluateAnswer(
      question.question,
      answer
    );

    aiResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(aiResponse);

    question.score = result.score || 0;
    question.feedback = result.feedback || "";
    question.correctAnswer = result.correctAnswer || "";
    question.improvement = result.improvement || "";

 // Calculate overall score
const totalScore = interview.questions.reduce(
  (sum, q) => sum + (q.score || 0),
  0
);

if (interview.questions.length > 0) {
  interview.overallScore = Number(
    (totalScore / interview.questions.length).toFixed(2)
  );
}

await interview.save();

    res.status(200).json({
      success: true,
      message: "Answer evaluated successfully",
      question,
      overallScore: interview.overallScore,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Get All Interviews
// ======================
const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Export
// ======================
module.exports = {
  createInterview,
  getInterview,
  submitAnswer,
  getMyInterviews,
};