 const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// =========================
// Generate Interview Questions
// =========================
const generateQuestions = async (
  jobRole,
  experience,
  difficulty
) => {
  try {

    const prompt = `
You are an expert technical interviewer.

Generate exactly 10 interview questions for the given role.

Role: ${jobRole}
Experience Level: ${experience || "Fresher"}
Difficulty Level: ${difficulty || "Easy"}

Return ONLY a valid JSON array.

Required format:

[
  {
    "question": "Question text here"
  }
]

Rules:
- Generate exactly 10 questions.
- Only JSON output.
- No markdown.
- No explanation.
- No extra text.
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




// =========================
// Evaluate Candidate Answer
// =========================
const evaluateAnswer = async (
  question,
  answer
) => {

  try {

    const prompt = `
You are an expert technical interviewer.

Analyze the candidate answer.

Interview Question:
${question}

Candidate Answer:
${answer}


Return ONLY valid JSON.

Format:

{
 "score": 8,
 "feedback": "Short feedback",
 "correctAnswer": "Ideal answer",
 "improvement": "Improvement suggestions"
}


Rules:
- Score must be between 0 and 10.
- Be fair and technical.
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




// =========================
// Export
// =========================
module.exports = {
  generateQuestions,
  evaluateAnswer,
};