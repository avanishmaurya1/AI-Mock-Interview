 const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

// ======================
// CORS Configuration
// ======================

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-mock-interview-murex-six.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// ======================
// Body Parser
// ======================

app.use(
  express.json({
    limit: "10mb",
  })
);

// ======================
// Routes
// ======================

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/interview", interviewRoutes);

// ======================
// Home Route
// ======================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Mock Interview Backend Running",
  });
});

// ======================
// 404 Route
// ======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ======================
// Global Error Handler
// ======================

app.use((err, req, res, next) => {
  console.error("=================================");
  console.error("GLOBAL ERROR:");
  console.error(err);
  console.error("=================================");

  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// ======================
// Server Start
// ======================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
