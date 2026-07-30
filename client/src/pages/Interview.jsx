 
import { useState } from "react";
import API from "../api/axios";

function Interview() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    jobRole: "",
    experience: "Fresher",
    difficulty: "Easy",
  });

  const [interviewId, setInterviewId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // =========================
  // Handle Input Changes
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // =========================
  // Start Interview
  // =========================
  const startInterview = async () => {
    if (!formData.jobRole.trim()) {
      setError("Please enter a job role.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/interview", formData);

      if (!res.data?.interview) {
        throw new Error("Invalid interview response.");
      }

      setInterviewId(res.data.interview._id);
      setQuestions(res.data.interview.questions || []);
      setCurrentQuestion(0);
      setAnswer("");
      setResult(null);
      setStarted(true);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to start interview."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Submit Answer
  // =========================
  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please write your answer before submitting.");
      return;
    }

    const question = questions[currentQuestion];

    if (!question) {
      setError("Question not found.");
      return;
    }

    try {
      setLoading(true);
      setError("");

     const res = await API.post(
  "/interview/" + interviewId + "/answer",
  {
    questionId: question._id,
    answer: answer.trim(),
  }
);
      const updatedQuestion = res.data.question;

      const updatedQuestions = [...questions];

      updatedQuestions[currentQuestion] = updatedQuestion;

      setQuestions(updatedQuestions);
      setAnswer("");

      if (currentQuestion + 1 < updatedQuestions.length) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setResult({
          overallScore: res.data.overallScore,
          questions: updatedQuestions,
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to evaluate your answer."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Restart Interview
  // =========================
  const restartInterview = () => {
    setStarted(false);
    setLoading(false);
    setInterviewId("");
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswer("");
    setResult(null);
    setError("");
  };

  // =========================
  // START SCREEN
  // =========================
  if (!started) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-3xl ring-1 ring-blue-500/30">
              🤖
            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              AI Mock Interview
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Practice real interview questions, get AI-powered
              evaluation, and improve your interview performance.
            </p>
          </div>

          {/* Main Card */}
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-blue-950/30">
            {/* Card Header */}
            <div className="border-b border-slate-800 bg-gradient-to-r from-blue-600/10 to-cyan-500/5 px-6 py-6 sm:px-8">
              <h2 className="text-xl font-semibold">
                Set Up Your Interview
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Choose your role and difficulty level to generate
                personalized AI interview questions.
              </p>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Job Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Job Role
                </label>

                <input
                  type="text"
                  name="jobRole"
                  placeholder="e.g. Full Stack Developer"
                  value={formData.jobRole}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Experience + Difficulty */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Experience
                  </label>

                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option>Fresher</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Difficulty
                  </label>

                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-2 text-xl">🧠</div>
                  <p className="text-sm font-medium">AI Questions</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Personalized questions
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-2 text-xl">📊</div>
                  <p className="text-sm font-medium">AI Scoring</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Answer evaluation
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-2 text-xl">💡</div>
                  <p className="text-sm font-medium">Feedback</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Improvement tips
                  </p>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={startInterview}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating AI Questions...
                  </>
                ) : (
                  <>
                    Start Interview
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // RESULT SCREEN
  // =========================
  if (result) {
    const score = Number(result.overallScore || 0);

    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          {/* Completion Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/20 text-4xl ring-1 ring-blue-500/30">
              🎉
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Interview Completed!
            </h1>

            <p className="mt-2 text-slate-400">
              Here is your AI-generated interview performance report.
            </p>
          </div>

          {/* Score Card */}
          <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
            <p className="text-sm uppercase tracking-widest text-slate-500">
              Overall Score
            </p>

            <div className="mt-3 text-6xl font-bold text-blue-400">
              {score.toFixed(1)}
              <span className="text-2xl text-slate-500">/10</span>
            </div>

            <div className="mx-auto mt-6 h-3 max-w-md overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all"
                style={{
 width: (Math.min(score * 10, 100) + "%"),
                }}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-5">
            {result.questions.map((q, index) => (
              <div
                key={q._id || index}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold leading-relaxed">
                    <span className="mr-2 text-blue-400">
                      Q{index + 1}.
                    </span>
                    {q.question}
                  </h3>

                  <span className="shrink-0 rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-400">
                    {q.score || 0}/10
                  </span>
                </div>

                {/* Your Answer */}
                <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Your Answer
                  </p>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                    {q.answer || "No answer provided."}
                  </p>
                </div>

                {/* AI Feedback */}
                {q.feedback && (
                  <div className="mb-4 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                      AI Feedback
                    </p>

                    <p className="text-sm leading-7 text-slate-300">
                      {q.feedback}
                    </p>
                  </div>
                )}

                {/* Correct Answer */}
                {q.correctAnswer && (
                  <div className="mb-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Better Answer
                    </p>

                    <p className="text-sm leading-7 text-slate-300">
                      {q.correctAnswer}
                    </p>
                  </div>
                )}

                {/* Improvement */}
                {q.improvement && (
                  <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      How to Improve
                    </p>

                    <p className="text-sm leading-7 text-slate-300">
                      {q.improvement}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Restart */}
          <div className="mt-8 text-center">
            <button
              onClick={restartInterview}
              className="rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // QUESTION SCREEN
  // =========================
  const question = questions[currentQuestion];

  if (!question) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <p className="mb-4 text-slate-400">
            Unable to load the interview question.
          </p>

          <button
            onClick={restartInterview}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  const isLastQuestion =
    currentQuestion === questions.length - 1;

  // =========================
  // INTERVIEW SCREEN
  // =========================
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        {/* Top Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-blue-400">
              AI Mock Interview
            </p>

            <h1 className="text-2xl font-bold">
              {formData.jobRole}
            </h1>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-400">
            {formData.difficulty} • {formData.experience}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-300">
              Interview Progress
            </span>

            <span className="text-blue-400">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
              style={{
              width: progress + "%",
              }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Question Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-blue-950/20">
          {/* Question Header */}
          <div className="border-b border-slate-800 bg-gradient-to-r from-blue-600/10 to-cyan-500/5 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
                {currentQuestion + 1}
              </span>

              <span className="text-sm font-medium text-slate-400">
                Interview Question
              </span>
            </div>

            <h2 className="text-xl font-semibold leading-8 sm:text-2xl">
              {question.question}
            </h2>
          </div>

          {/* Answer Area */}
          <div className="p-6 sm:p-8">
            <label className="mb-3 block text-sm font-medium text-slate-300">
              Your Answer
            </label>

            <textarea
              rows="10"
              placeholder="Explain your answer clearly and confidently..."
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError("");
              }}
              className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-5 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <div className="mt-3 flex justify-between text-xs text-slate-600">
              <span>
                Take your time and explain your approach.
              </span>

              <span>{answer.length} characters</span>
            </div>

            {/* Submit */}
            <button
              onClick={submitAnswer}
              disabled={loading || !answer.trim()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  AI is evaluating your answer...
                </>
              ) : (
                <>
                  {isLastQuestion
                    ? "Finish Interview"
                    : "Submit & Next Question"}
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center text-sm text-slate-500">
          💡 Tip: Give structured answers with examples whenever
          possible.
        </div>
      </div>
    </div>
  );
}

export default Interview;
 