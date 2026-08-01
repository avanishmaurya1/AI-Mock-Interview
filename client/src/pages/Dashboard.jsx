 import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // =========================
  // Dynamic Greeting
  // =========================
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  // =========================
  // Fetch Interviews
  // =========================
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/interview");

      if (!res.data.success) {
        throw new Error(
          res.data.message || "Failed to fetch interviews."
        );
      }

      setInterviews(res.data.interviews || []);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Score Helpers
  // =========================
  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Average";
    return "Needs Practice";
  };

  // =========================
  // Statistics
  // =========================
  const totalInterviews = interviews.length;

  const completedInterviews = interviews.filter(
    (interview) =>
      interview.questions?.some(
        (question) =>
          question.answer &&
          question.answer.trim().length > 0
      )
  ).length;

  const averageScore =
    interviews.length > 0
      ? (
          interviews.reduce(
            (sum, interview) =>
              sum +
              (Number(interview.overallScore) || 0),
            0
          ) / interviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/* =========================
            Header
        ========================= */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              {greeting}
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Welcome, {user.name || "Candidate"}
            </h1>

            <p className="mt-2 text-slate-400">
              Track your AI interview practice and improve your performance.
            </p>
          </div>

          <Link
            to="/interview"
            className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold transition hover:bg-blue-500"
          >
            + Start New Interview
          </Link>

        </div>

        {/* =========================
            Stats
        ========================= */}
        <div className="grid gap-4 md:grid-cols-3">

          {/* Total Interviews */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/40">

            <p className="text-sm text-slate-400">
              Total Interviews
            </p>

            <p className="mt-2 text-4xl font-bold">
              {totalInterviews}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              AI interviews attempted
            </p>

          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/40">

            <p className="text-sm text-slate-400">
              Completed
            </p>

            <p className="mt-2 text-4xl font-bold">
              {completedInterviews}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Interviews with answers
            </p>

          </div>

          {/* Average Score */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/40">

            <p className="text-sm text-slate-400">
              Average Score
            </p>

            <p className="mt-2 text-4xl font-bold text-blue-400">
              {averageScore}
              <span className="text-xl text-slate-500">
                /10
              </span>
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Overall performance
            </p>

          </div>

        </div>

        {/* =========================
            Recent Interviews
        ========================= */}
        <div className="mt-10">

          <div className="mb-5 flex items-end justify-between">

            <div>
              <h2 className="text-2xl font-bold">
                Recent Interviews
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Review your previous interview sessions.
              </p>
            </div>

            <button
              onClick={fetchInterviews}
              className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              Refresh
            </button>

          </div>

          {/* =========================
              Loading
          ========================= */}
          {loading && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

              <p className="text-slate-400">
                Loading interviews...
              </p>

            </div>
          )}

          {/* =========================
              Error
          ========================= */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-900/50 bg-slate-900 p-8 text-center">

              <p className="text-red-400">
                {error}
              </p>

              <button
                onClick={fetchInterviews}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold transition hover:bg-blue-500"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =========================
              Empty State
          ========================= */}
          {!loading &&
            !error &&
            interviews.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-2xl font-bold text-blue-400">
                  AI
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  No interviews yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-slate-400">
                  Start your first AI mock interview and get
                  personalized feedback on your answers.
                </p>

                <Link
                  to="/interview"
                  className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
                >
                  Start Your First Interview
                </Link>

              </div>
            )}

          {/* =========================
              Interview Cards
          ========================= */}
          {!loading &&
            !error &&
            interviews.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">

                {interviews.map((interview) => {

                  const score =
                    Number(interview.overallScore) || 0;

                  const date = interview.createdAt
                    ? new Date(
                        interview.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Unknown date";

                  const questionCount =
                    interview.questions?.length || 0;

                  return (
                    <div
                      key={interview._id}
                      className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5"
                    >

                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <h3 className="text-xl font-bold">
                            {interview.jobRole}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {date}
                          </p>
                        </div>

                        <div className="text-right">

                          <p
                            className={`text-2xl font-bold ${getScoreColor(
                              score
                            )}`}
                          >
                            {score}/10
                          </p>

                          <p
                            className={`text-xs font-medium ${getScoreColor(
                              score
                            )}`}
                          >
                            {getScoreLabel(score)}
                          </p>

                        </div>

                      </div>

                      {/* Tags */}
                      <div className="mt-5 flex flex-wrap gap-2">

                        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
                          {interview.experience || "Fresher"}
                        </span>

                        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
                          {interview.difficulty || "Easy"}
                        </span>

                        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
                          {questionCount} Questions
                        </span>

                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex gap-3">

                        <Link
                          to={`/interview/${interview._id}`}
                          className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold transition hover:bg-blue-500"
                        >
                          View Report
                        </Link>

                        <Link
                          to="/interview"
                          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                        >
                          New
                        </Link>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;