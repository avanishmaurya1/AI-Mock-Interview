 const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createInterview,
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
// Create New Interview
// ======================
router.post(
  "/",
  protect,
  createInterview
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
// Submit Answer & AI Evaluation
// ======================
router.post(
  "/:id/answer",
  protect,
  submitAnswer
);


module.exports = router;