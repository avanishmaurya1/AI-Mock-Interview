 import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

function InterviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/interview/${id}`);

        setInterview(res.data.interview);
      } catch (err) {
        console.error("Failed to fetch interview:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load interview result."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInterview();
    }
  }, [id]);

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

              <p className="mt-4 text-sm text-slate-500">
                Loading your interview result...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-2xl border border-red-500/20 bg-slate-900 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <span className="text-xl text-red-400">!</span>
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Unable to Load Result
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error || "Interview result not found."}
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Data
  // =========================

  const questions = interview.questions || [];

  const overallScore = Number(
    interview.overallScore || 0
  );

  const percentage = Math.min(
    100,
    Math.max(0, overallScore * 10)
  );

  const answeredQuestions = questions.filter(
    (item) =>
      item.answer &&
      item.answer.trim().length > 0
  ).length;

  const totalQuestions = questions.length;

  const averageQuestionScore =
    questions.length > 0
      ? (
          questions.reduce(
            (sum, item) =>
              sum + Number(item.score || 0),
            0
          ) / questions.length
        ).toFixed(1)
      : "0.0";

  // =========================
  // Performance Status
  // =========================

  const performance = useMemo(() => {
    if (overallScore >= 8.5) {
      return {
        title: "Excellent Performance",
        description:
          "Your answers demonstrate strong interview readiness.",
        className: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      };
    }

    if (overallScore >= 7) {
      return {
        title: "Strong Performance",
        description:
          "You are performing well with a few areas to polish.",
        className: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
      };
    }

    if (overallScore >= 5) {
      return {
        title: "Good Progress",
        description:
          "You have a solid foundation. Keep practicing consistently.",
        className: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
      };
    }

    return {
      title: "Needs Improvement",
      description:
        "Focus on the feedback below and practice more interview questions.",
      className: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    };
  }, [overallScore]);

  // =========================
  // Strengths
  // =========================

  const strengths = useMemo(() => {
    const result = [];

    const strongQuestions = questions.filter(
      (item) => Number(item.score || 0) >= 7
    );

    if (strongQuestions.length > 0) {
      result.push(
        `You performed strongly in ${strongQuestions.length} question${
          strongQuestions.length > 1 ? "s" : ""
        }.`
      );
    }

    if (answeredQuestions === totalQuestions && totalQuestions > 0) {
      result.push(
        "You attempted every interview question."
      );
    }

    const detailedAnswers = questions.filter(
      (item) =>
        item.answer &&
        item.answer.trim().length >= 80
    );

    if (detailedAnswers.length >= Math.ceil(totalQuestions / 2)) {
      result.push(
        "Your answers generally contain useful detail and explanation."
      );
    }

    if (overallScore >= 7) {
      result.push(
        "Your overall interview performance is above the basic practice level."
      );
    }

    if (result.length === 0) {
      result.push(
        "You completed the interview and now have clear feedback to work from."
      );

      result.push(
        "Your attempt provides a useful baseline for future practice."
      );
    }

    return result.slice(0, 4);
  }, [
    questions,
    answeredQuestions,
    totalQuestions,
    overallScore,
  ]);

  // =========================
  // Weaknesses
  // =========================

  const weaknesses = useMemo(() => {
    const result = [];

    const weakQuestions = questions.filter(
      (item) => Number(item.score || 0) < 5
    );

    if (weakQuestions.length > 0) {
      result.push(
        `${weakQuestions.length} answer${
          weakQuestions.length > 1 ? "s" : ""
        } scored below 5/10 and need more attention.`
      );
    }

    const shortAnswers = questions.filter(
      (item) =>
        item.answer &&
        item.answer.trim().length < 40
    );

    if (shortAnswers.length > 0) {
      result.push(
        "Some answers are quite short and could use more explanation or examples."
      );
    }

    const unanswered = questions.filter(
      (item) =>
        !item.answer ||
        item.answer.trim().length === 0
    );

    if (unanswered.length > 0) {
      result.push(
        `${unanswered.length} question${
          unanswered.length > 1 ? "s were" : " was"
        } not answered completely.`
      );
    }

    if (overallScore < 6) {
      result.push(
        "Your overall score suggests that more structured interview practice is required."
      );
    }

    if (result.length === 0) {
      result.push(
        "Continue improving answer structure, clarity, and use of practical examples."
      );
    }

    return result.slice(0, 4);
  }, [questions, overallScore]);

  // =========================
  // Improvement Suggestions
  // =========================

  const improvements = useMemo(() => {
    const result = [];

    if (overallScore < 6) {
      result.push(
        "Practice core concepts regularly before attempting another full interview."
      );
    }

    if (overallScore >= 6 && overallScore < 8) {
      result.push(
        "Focus on giving more structured and technically detailed answers."
      );
    }

    if (overallScore >= 8) {
      result.push(
        "Maintain your current performance while practicing advanced and scenario-based questions."
      );
    }

    const shortAnswers = questions.filter(
      (item) =>
        item.answer &&
        item.answer.trim().length < 80
    );

    if (shortAnswers.length > 0) {
      result.push(
        "Expand your answers with a short explanation, example, and practical use case."
      );
    }

    result.push(
      "Use the STAR structure for behavioral questions: Situation, Task, Action, Result."
    );

    result.push(
      "Review the AI feedback after every interview and retry the questions where your score was low."
    );

    return result.slice(0, 4);
  }, [questions, overallScore]);

  // =========================
  // Score Ring
  // =========================

  const scoreRingStyle = {
    background: `conic-gradient(
      rgb(59 130 246) ${percentage}%,
      rgb(30 41 59) ${percentage}% 100%
    )`,
  };

  // =========================
  // Date
  // =========================

  const interviewDate = interview.createdAt
    ? new Date(
        interview.createdAt
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  // =========================
  // JSX
  // =========================

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            Top Header
        ========================= */}

        <div className="mb-8 flex flex-col gap-5 border-b border-slate-800 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 text-sm font-medium text-slate-500 transition hover:text-blue-400"
            >
              ← Back to Dashboard
            </button>

            <p className="text-sm font-medium text-blue-400">
              Interview Result
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {interview.jobRole || "Interview"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Detailed performance analysis of your interview session.
            </p>
          </div>

          <button
            onClick={() => navigate("/interview")}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Practice Again
          </button>
        </div>

        {/* =========================
            Interview Meta
        ========================= */}

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-600">
              Experience
            </p>

            <p className="mt-2 font-semibold text-slate-200">
              {interview.experience || "Fresher"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-600">
              Difficulty
            </p>

            <p className="mt-2 font-semibold text-slate-200">
              {interview.difficulty || "Easy"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-600">
              Questions
            </p>

            <p className="mt-2 font-semibold text-slate-200">
              {totalQuestions}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-600">
              Interview Date
            </p>

            <p className="mt-2 font-semibold text-slate-200">
              {interviewDate}
            </p>
          </div>
        </div>

        {/* =========================
            Score Overview
        ========================= */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Score Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 lg:col-span-1">
            <p className="text-sm font-medium text-slate-500">
              Overall Score
            </p>

            <div className="mt-7 flex justify-center">
              <div
                className="relative flex h-52 w-52 items-center justify-center rounded-full"
                style={scoreRingStyle}
              >
                <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-slate-900">
                  <span className="text-5xl font-bold text-white">
                    {overallScore.toFixed(1)}
                  </span>

                  <span className="mt-1 text-sm text-slate-500">
                    out of 10
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`mt-7 rounded-xl border px-4 py-4 ${performance.bg} ${performance.border}`}
            >
              <p
                className={`font-semibold ${performance.className}`}
              >
                {performance.title}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {performance.description}
              </p>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-500">
                Average Question Score
              </p>

              <h2 className="mt-3 text-4xl font-bold text-blue-400">
                {averageQuestionScore}
                <span className="ml-1 text-base text-slate-600">
                  /10
                </span>
              </h2>

              <p className="mt-3 text-sm text-slate-600">
                Average performance across all questions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-500">
                Completion
              </p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                {answeredQuestions}
                <span className="text-xl text-slate-600">
                  /{totalQuestions}
                </span>
              </h2>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${
                      totalQuestions
                        ? (answeredQuestions /
                            totalQuestions) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm text-slate-600">
                Questions attempted
              </p>
            </div>

            {/* Score Distribution */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-white">
                    Score Distribution
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Performance by question
                  </p>
                </div>

                <span className="text-sm text-slate-600">
                  /10
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {questions.map((item, index) => {
                  const score = Number(
                    item.score || 0
                  );

                  return (
                    <div key={item._id || index}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-400">
                          Q{index + 1}
                        </span>

                        <span className="font-semibold text-blue-400">
                          {score.toFixed(1)}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, score * 10)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            Strengths / Weaknesses
        ========================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Strengths */}
          <div className="rounded-2xl border border-emerald-500/10 bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                ✓
              </div>

              <div>
                <h2 className="font-bold text-white">
                  Strengths
                </h2>

                <p className="text-sm text-slate-500">
                  What you did well
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {strengths.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <span className="mt-0.5 text-emerald-400">
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-slate-400">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="rounded-2xl border border-amber-500/10 bg-slate-900 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                !
              </div>

              <div>
                <h2 className="font-bold text-white">
                  Areas to Improve
                </h2>

                <p className="text-sm text-slate-500">
                  Focus areas from this interview
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {weaknesses.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <span className="mt-0.5 text-amber-400">
                    !
                  </span>

                  <p className="text-sm leading-6 text-slate-400">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================
            Improvement Suggestions
        ========================= */}

        <div className="mt-6 rounded-2xl border border-blue-500/10 bg-slate-900 p-6">
          <div>
            <p className="text-sm font-medium text-blue-400">
              Action Plan
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              How to Improve
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Practical steps based on your interview performance.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {improvements.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-5"
              >
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-400">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-6 text-slate-400">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================
            Question-by-Question Review
        ========================= */}

        <div className="mt-6">
          <div className="mb-5">
            <p className="text-sm font-medium text-blue-400">
              Detailed Review
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Question-by-Question Analysis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review your answers and understand how you can improve.
            </p>
          </div>

          <div className="space-y-5">
            {questions.map((item, index) => {
              const score = Number(
                item.score || 0
              );

              return (
                <div
                  key={item._id || index}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                >
                  {/* Question Header */}
                  <div className="border-b border-slate-800 bg-slate-950/50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-400">
                          {index + 1}
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-600">
                            Question {index + 1}
                          </p>

                          <h3 className="mt-1 font-semibold leading-7 text-white">
                            {item.question}
                          </h3>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-center">
                        <span className="text-lg font-bold text-blue-400">
                          {score.toFixed(1)}
                        </span>

                        <span className="text-xs text-slate-600">
                          /10
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="grid gap-4 p-5 lg:grid-cols-2">

                    {/* Candidate Answer */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Your Answer
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-400">
                        {item.answer?.trim()
                          ? item.answer
                          : "No answer provided."}
                      </p>
                    </div>

                    {/* AI Feedback */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        AI Feedback
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-400">
                        {item.feedback?.trim()
                          ? item.feedback
                          : "No feedback available."}
                      </p>
                    </div>

                    {/* Better Answer */}
                    <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-400">
                        Better Answer
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-400">
                        {item.correctAnswer?.trim()
                          ? item.correctAnswer
                          : "No model answer available."}
                      </p>
                    </div>

                    {/* Improvement */}
                    <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-400">
                        Improvement Suggestion
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-400">
                        {item.improvement?.trim()
                          ? item.improvement
                          : "Keep practicing this type of question and focus on clarity and structure."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================
            Bottom CTA
        ========================= */}

        <div className="mt-8 rounded-2xl border border-blue-500/10 bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-900 p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Ready for another attempt?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Practice again and compare your performance with this result.
              </p>
            </div>

            <button
              onClick={() => navigate("/interview")}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Start New Interview
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default InterviewDetails;