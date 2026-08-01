 import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";

function InterviewDetails() {
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/interview/${id}`);

        if (!res.data.success) {
          throw new Error(
            res.data.message || "Failed to load interview."
          );
        }

        setInterview(res.data.interview);
      } catch (err) {
        console.error("FETCH INTERVIEW ERROR:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load interview."
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
      <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <h2 className="text-xl font-semibold">
              Loading Interview Report
            </h2>

            <p className="mt-2 text-slate-400">
              Please wait while we prepare your report...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
          <div className="w-full rounded-2xl border border-red-900/50 bg-slate-900 p-8 text-center shadow-xl">
            <div className="mb-5 text-5xl">!</div>

            <h2 className="text-2xl font-bold">
              Unable to Load Report
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {error}
            </p>

            <Link
              to="/dashboard"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  // =========================
  // Interview Data
  // =========================

  const questions = interview.questions || [];

  const answeredQuestions = questions.filter(
    (question) =>
      question.answer &&
      question.answer.trim().length > 0
  );

  const totalScore = questions.reduce(
    (sum, question) =>
      sum + (Number(question.score) || 0),
    0
  );

  const calculatedScore =
    questions.length > 0
      ? Number(
          (totalScore / questions.length).toFixed(2)
        )
      : 0;

  const overallScore =
    typeof interview.overallScore === "number"
      ? interview.overallScore
      : calculatedScore;

  const percentage =
    questions.length > 0
      ? Math.round((overallScore / 10) * 100)
      : 0;

  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Needs Improvement";
    return "Needs More Practice";
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/* =========================
            Header
        ========================= */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Interview Report
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              {interview.jobRole}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300">
                {interview.experience || "Fresher"}
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300">
                {interview.difficulty || "Easy"}
              </span>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-center font-medium text-slate-200 transition hover:border-blue-500 hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* =========================
            Score Overview
        ========================= */}

        <div className="mb-8 grid gap-5 md:grid-cols-3">

          {/* Overall Score */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <p className="text-sm font-medium text-slate-400">
              Overall Score
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span
                className={`text-5xl font-bold ${getScoreColor(
                  overallScore
                )}`}
              >
                {overallScore}
              </span>

              <span className="mb-2 text-slate-500">
                / 10
              </span>
            </div>

            <p
              className={`mt-2 font-semibold ${getScoreColor(
                overallScore
              )}`}
            >
              {getScoreLabel(overallScore)}
            </p>
          </div>

          {/* Questions */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <p className="text-sm font-medium text-slate-400">
              Questions
            </p>

            <div className="mt-3 text-5xl font-bold text-white">
              {questions.length}
            </div>

            <p className="mt-2 text-sm text-slate-400">
              {answeredQuestions.length} answered
            </p>
          </div>

          {/* Completion */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <p className="text-sm font-medium text-slate-400">
              Completion
            </p>

            <div className="mt-3 text-5xl font-bold text-blue-400">
              {percentage}%
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(percentage, 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* =========================
            Performance Summary
        ========================= */}

        <div className="mb-8 rounded-2xl border border-blue-900/40 bg-gradient-to-br from-blue-950/40 to-slate-900 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Performance Summary
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {getScoreLabel(overallScore)}
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            You completed {answeredQuestions.length} out of{" "}
            {questions.length} interview questions with an
            overall score of {overallScore}/10. Review the
            individual feedback below to identify areas where
            you can improve.
          </p>
        </div>

        {/* =========================
            Questions & Feedback
        ========================= */}

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Detailed Evaluation
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Question-by-Question Feedback
            </h2>
          </div>

          {questions.map((question, index) => {
            const score = Number(question.score) || 0;

            const hasAnswer =
              question.answer &&
              question.answer.trim().length > 0;

            return (
              <div
                key={question._id || index}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg"
              >

                {/* Question Header */}

                <div className="flex flex-col gap-4 border-b border-slate-800 p-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 font-bold text-blue-400">
                      {index + 1}
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Question {index + 1}
                      </p>

                      <h3 className="mt-1 text-lg font-semibold leading-7 text-white">
                        {question.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`shrink-0 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-center ${getScoreColor(
                      score
                    )}`}
                  >
                    <div className="text-2xl font-bold">
                      {score}/10
                    </div>

                    <div className="text-xs text-slate-500">
                      Score
                    </div>
                  </div>
                </div>

                {/* Candidate Answer */}

                <div className="border-b border-slate-800 p-6">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Your Answer
                  </p>

                  {hasAnswer ? (
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 leading-7 text-slate-300">
                      {question.answer}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4 text-slate-500">
                      No answer submitted.
                    </div>
                  )}
                </div>

                {/* AI Feedback */}

                <div className="grid gap-5 p-6 md:grid-cols-2">

                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
                      AI Feedback
                    </p>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 leading-7 text-slate-300">
                      {question.feedback ||
                        "No feedback available."}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-400">
                      Correct Answer
                    </p>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 leading-7 text-slate-300">
                      {question.correctAnswer ||
                        "No correct answer available."}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-yellow-400">
                      How to Improve
                    </p>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 leading-7 text-slate-300">
                      {question.improvement ||
                        "Keep practicing this topic and focus on explaining your answer clearly."}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* =========================
            Bottom Actions
        ========================= */}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Link
            to="/interview"
            className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-500"
          >
            Start New Interview
          </Link>

          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-center font-semibold text-slate-200 transition hover:border-blue-500 hover:bg-slate-800"
          >
            View Dashboard
          </Link>

        </div>

      </div>
    </div>
  );
}

export default InterviewDetails;