 const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// Generate Interview Questions
// =====================================================
const generateQuestions = async (
  jobRole,
  experience,
  difficulty,
  interviewType = "Technical",
  resumeText = ""
) => {
  try {
    let interviewFocus = "";

    switch (interviewType) {
      case "HR":
        interviewFocus = `
Focus on HR and personality-based questions such as:
- Introduction
- Strengths and weaknesses
- Career goals
- Teamwork
- Conflict handling
- Leadership
- Motivation
- Company/job suitability
`;
        break;

      case "Behavioral":
        interviewFocus = `
Focus on behavioral and situational questions.

Prefer situations involving:
- Teamwork
- Leadership
- Problem solving
- Conflict resolution
- Decision making
- Failure and learning
- Communication

Use practical real-world scenarios.
`;
        break;

      case "Coding":
        interviewFocus = `
Focus on coding and programming questions.

Include topics such as:
- Programming concepts
- Data structures
- Algorithms
- Problem solving
- Complexity
- Debugging
- Practical coding scenarios

Questions should be suitable for the given job role.
`;
        break;

      case "Mixed":
        interviewFocus = `
Create a balanced interview containing:
- Technical questions
- HR questions
- Behavioral questions
- Practical/problem-solving questions

Keep the questions relevant to the job role.
`;
        break;

      case "Technical":
      default:
        interviewFocus = `
Focus primarily on technical questions related to the job role.

Cover:
- Core technical concepts
- Practical implementation
- Problem solving
- Tools and technologies
- Real-world scenarios
`;
        break;
    }

    const resumeSection = resumeText?.trim()
      ? `
IMPORTANT:
The candidate has provided resume information.

Use the resume information to personalize the interview.

Ask questions specifically related to:
- Projects
- Skills
- Technologies
- Education
- Experience
- Certifications
- Achievements

Do not invent information that is not present in the resume.

Candidate Resume:
${resumeText}
`
      : `
No resume has been provided.

Generate questions based only on the job role, experience and interview type.
`;

    const prompt = `
You are an expert professional interviewer.

Generate exactly 10 interview questions.

Job Role:
${jobRole}

Experience Level:
${experience || "Fresher"}

Difficulty Level:
${difficulty || "Easy"}

Interview Type:
${interviewType}

${interviewFocus}

${resumeSection}

Rules:
- Generate exactly 10 questions.
- Questions must be relevant to the selected interview type.
- Questions must match the candidate's experience level.
- Questions must match the selected difficulty.
- If a resume is provided, personalize questions using the resume.
- Do not invent resume information.
- Return ONLY valid JSON.
- No markdown.
- No explanation.
- No extra text.

Required JSON format:

[
  {
    "question": "Question text here"
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty response from Gemini");
    }

    return response.text.trim();
  } catch (error) {
    console.error(
      "Generate Questions Error:",
      error.message
    );

    throw new Error(
      "Failed to generate interview questions"
    );
  }
};

// =====================================================
// Evaluate Candidate Answer
// =====================================================
const evaluateAnswer = async (
  question,
  answer,
  interviewType = "Technical"
) => {
  try {
    let evaluationFocus = "";

    switch (interviewType) {
      case "HR":
        evaluationFocus = `
Evaluate:
- Communication
- Confidence
- Professionalism
- Clarity
- Relevance
- Personality
`;
        break;

      case "Behavioral":
        evaluationFocus = `
Evaluate:
- Situation understanding
- Decision making
- Problem solving
- Communication
- Teamwork
- Learning mindset
`;
        break;

      case "Coding":
        evaluationFocus = `
Evaluate:
- Technical correctness
- Logic
- Algorithm
- Complexity
- Problem solving
- Code quality
`;
        break;

      case "Mixed":
        evaluationFocus = `
Evaluate the answer based on:
- Technical correctness
- Communication
- Problem solving
- Practical understanding
- Professionalism
`;
        break;

      case "Technical":
      default:
        evaluationFocus = `
Evaluate:
- Technical correctness
- Conceptual understanding
- Practical knowledge
- Accuracy
- Problem solving
`;
        break;
    }

    const prompt = `
You are an expert interviewer evaluating a candidate.

Interview Type:
${interviewType}

Interview Question:
${question}

Candidate Answer:
${answer}

${evaluationFocus}

Return ONLY valid JSON.

Required format:

{
  "score": 8,
  "feedback": "Short and specific feedback",
  "correctAnswer": "Ideal answer",
  "improvement": "Specific improvement suggestions"
}

Rules:
- Score must be between 0 and 10.
- Be fair and realistic.
- Evaluate according to the interview type.
- Feedback must be useful for the candidate.
- No markdown.
- No explanation outside JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty response from Gemini");
    }

    return response.text.trim();
  } catch (error) {
    console.error(
      "Evaluate Answer Error:",
      error.message
    );

    throw new Error(
      "Failed to evaluate answer"
    );
  }
};

// =====================================================
// Voice Interview Support
// =====================================================

const generateVoiceInterviewResponse = async (
  question,
  answer,
  interviewType = "Technical"
) => {
  try {
    const evaluationText = await evaluateAnswer(
      question,
      answer,
      interviewType
    );

    return evaluationText;
  } catch (error) {
    console.error(
      "VOICE INTERVIEW ERROR:",
      error.message
    );

    throw new Error(
      "Failed to process voice interview response"
    );
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  generateQuestions,
  evaluateAnswer,
  generateVoiceInterviewResponse,
};