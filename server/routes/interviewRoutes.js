 const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createInterview,
  createResumeInterview,
  getInterview,
  submitAnswer,
  getMyInterviews,
} = require("../controllers/interviewController");

// ======================
// Get All User Interviews
// ======================
router.get(
  "/",
  protect,
  getMyInterviews
);

// ======================
// Create Normal Interview
// ======================
router.post(
  "/",
  protect,
  createInterview
);

// ======================
// Create Resume Interview
// ======================
router.post(
  "/resume",
  protect,
  upload.single("resume"),
  createResumeInterview
);

// ======================
// Get Single Interview
// ======================
router.get(
  "/:id",
  protect,
  getInterview
);

// ======================
// Submit Answer
// ======================
router.post(
  "/:id/answer",
  protect,
  submitAnswer
);

module.exports = router;