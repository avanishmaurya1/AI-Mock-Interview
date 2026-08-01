const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const extractResumeText = async (file) => {
  if (!file) {
    throw new Error("Resume file is required.");
  }

  const fileName = file.originalname.toLowerCase();

  // =========================
  // PDF
  // =========================
  if (fileName.endsWith(".pdf")) {
    const data = await pdfParse(file.buffer);

    return data.text
      .replace(/\s+/g, " ")
      .trim();
  }

  // =========================
  // DOCX
  // =========================
  if (fileName.endsWith(".docx")) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value
      .replace(/\s+/g, " ")
      .trim();
  }

  throw new Error(
    "Unsupported resume format. Please upload PDF or DOCX."
  );
};

module.exports = {
  extractResumeText,
};