 const Interview = require("../models/Interview");

const {
  generateQuestions,
  evaluateAnswer,
  generateVoiceInterviewResponse,
} = require("../services/geminiService");

// =====================================================
// CREATE INTERVIEW
// =====================================================
const createInterview = async (req, res) => {
  try {
    const {
      jobRole,
      experience = "Fresher",
      difficulty = "Easy",
      interviewType = "Technical",
      resumeBased = false,
      resumeName = "",
      resumeText = "",
    } = req.body;

    // -----------------------------------------------
    // Validation
    // -----------------------------------------------
    if (!jobRole || !jobRole.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job role is required.",
      });
    }

    const allowedTypes = [
      "Technical",
      "HR",
      "Behavioral",
      "Coding",
      "Mixed",
    ];

    if (!allowedTypes.includes(interviewType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview type.",
      });
    }

    // -----------------------------------------------
    // Generate AI Questions
    // -----------------------------------------------
    const questionsText = await generateQuestions(
      jobRole.trim(),
      experience,
      difficulty,
      interviewType
    );

    // -----------------------------------------------
    // Parse Gemini Response
    // -----------------------------------------------
    let questions;

    try {
      questions = JSON.parse(questionsText);
    } catch (parseError) {
      console.error(
        "QUESTION JSON PARSE ERROR:",
        parseError.message
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned an invalid question format. Please try again.",
      });
    }

    // -----------------------------------------------
    // Validate Questions
    // -----------------------------------------------
    if (
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(500).json({
        success: false,
        message: "No interview questions were generated.",
      });
    }

    // -----------------------------------------------
    // Normalize Questions
    // -----------------------------------------------
    const formattedQuestions = questions.map((item) => ({
      question: item.question || "",
      answer: "",
      score: 0,
      feedback: "",
      correctAnswer: "",
      improvement: "",
    }));

    // -----------------------------------------------
    // Create Interview
    // -----------------------------------------------
    const interview = await Interview.create({
      user: req.user._id,

      jobRole: jobRole.trim(),

      interviewType,

      experience,

      difficulty,

      resumeBased: Boolean(resumeBased),

      resumeName: resumeName || "",

      resumeText: resumeText || "",

      questions: formattedQuestions,

      overallScore: 0,
    });

    // -----------------------------------------------
    // Response
    // -----------------------------------------------
    return res.status(201).json({
      success: true,
      message: "Interview created successfully.",
      interview,
    });
  } catch (error) {
    console.error(
      "CREATE INTERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create interview.",
    });
  }
};

// =====================================================
// SUBMIT ANSWER
// =====================================================
const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      questionId,
      answer,
    } = req.body;

    // -----------------------------------------------
    // Validation
    // -----------------------------------------------
    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required.",
      });
    }

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required.",
      });
    }

    // -----------------------------------------------
    // Find Interview
    // -----------------------------------------------
    const interview = await Interview.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    // -----------------------------------------------
    // Find Question
    // -----------------------------------------------
    const question = interview.questions.id(
      questionId
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // -----------------------------------------------
    // Evaluate Answer with Gemini
    // -----------------------------------------------
    const evaluationText = await evaluateAnswer(
      question.question,
      answer.trim()
    );

    // -----------------------------------------------
    // Parse Evaluation
    // -----------------------------------------------
    let evaluation;

    try {
      evaluation = JSON.parse(
        evaluationText
      );
    } catch (parseError) {
      console.error(
        "EVALUATION JSON PARSE ERROR:",
        parseError.message
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned an invalid evaluation format.",
      });
    }

    // -----------------------------------------------
    // Update Question
    // -----------------------------------------------
    question.answer = answer.trim();

    question.score = Math.min(
      10,
      Math.max(
        0,
        Number(evaluation.score) || 0
      )
    );

    question.feedback =
      evaluation.feedback || "";

    question.correctAnswer =
      evaluation.correctAnswer || "";

    question.improvement =
      evaluation.improvement || "";

    // -----------------------------------------------
    // Calculate Overall Score
    // -----------------------------------------------
    const answeredQuestions =
      interview.questions.filter(
        (item) =>
          item.answer &&
          item.answer.trim().length > 0
      );

    if (answeredQuestions.length > 0) {
      const totalScore =
        answeredQuestions.reduce(
          (sum, item) =>
            sum + (Number(item.score) || 0),
          0
        );

      interview.overallScore = Number(
        (
          totalScore /
          answeredQuestions.length
        ).toFixed(2)
      );
    }

    await interview.save();

    // -----------------------------------------------
    // Response
    // -----------------------------------------------
    return res.status(200).json({
      success: true,
      message: "Answer evaluated successfully.",
      question,
      overallScore:
        interview.overallScore,
    });
  } catch (error) {
    console.error(
      "SUBMIT ANSWER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to evaluate answer.",
    });
  }
};

// =====================================================
// GET MY INTERVIEWS
// =====================================================
const getMyInterviews = async (
  req,
  res
) => {
  try {
    const interviews =
      await Interview.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error(
      "GET MY INTERVIEWS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch interviews.",
    });
  }
};

// =====================================================
// GET SINGLE INTERVIEW
// =====================================================
const getInterview = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const interview =
      await Interview.findOne({
        _id: id,
        user: req.user._id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error(
      "GET INTERVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch interview.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================
module.exports = {
  createInterview,
  submitAnswer,
  getMyInterviews,
  getInterview,
};