 const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
          min: 0,
          max: 10,
        },

        feedback: {
          type: String,
          default: "",
        },

        correctAnswer: {
          type: String,
          default: "",
        },

        improvement: {
          type: String,
          default: "",
        },
      },
    ],

    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    status: {
      type: String,
      enum: ["started", "completed"],
      default: "started",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);