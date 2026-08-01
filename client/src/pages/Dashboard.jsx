 import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  // =========================
  // Greeting
  // =========================
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // =========================
  // Fetch Interviews
  // =========================
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get("/interview");

        setInterviews(res.data.interviews || []);
      } catch (error) {
        console.error(
          "Failed to fetch interviews:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // Statistics
  // =========================
  const totalInterviews = interviews.length;

  const averageScore = totalInterviews
    ? (
        interviews.reduce(
          (sum, item) =>
            sum + Number(item.overallScore || 0),
          0
        ) / totalInterviews
      ).toFixed(1)
    : "0.0";

  const bestScore = totalInterviews
    ? Math.max(
        ...interviews.map((item) =>
          Number(item.overallScore || 0)
        )
      ).toFixed(1)
    : "0.0";

  const totalQuestions = interviews.reduce(
    (total, item) =>
      total + (Array.isArray(item.questions)
        ? item.questions.length
        : 10),
    0
  );

  const performanceText = totalInterviews
    ? Number(averageScore) >= 8
      ? "Excellent"
      : Number(averageScore) >= 6
      ? "Good Progress"
      : "Keep Practicing"
    : "Not Rated";

  // =========================
  // Graph Data
  // =========================
  const graphInterviews = [...interviews]
    .reverse()
    .slice(-7);

  const getScoreHeight = (score) => {
    const value = Number(score || 0);

    return Math.max(
      8,
      Math.min(100, value * 10)
    );
  };

  return (
    <div className="min-h-screen bg-[#070b14] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            TOP NAVIGATION
        ====================================== */}
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/15 text-xl">
                🤖
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-400">
                  AI Mock Interview
                </p>

                <p className="text-xs text-slate-500">
                  Personal Interview Dashboard
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
          >
            Logout
          </button>
        </header>

        {/* ======================================
            HERO / GREETING
        ====================================== */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/15 via-slate-900 to-slate-950 p-6 sm:p-8">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <p className="mb-2 text-sm font-medium text-blue-400">
                {getGreeting()} 👋
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Welcome back,{" "}
                <span className="text-blue-400">
                  {user?.name || "User"}
                </span>
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-slate-400">
                Keep practicing, improve your answers,
                and get one step closer to your dream
                placement.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                <button
                  onClick={() => navigate("/interview")}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  🚀 Start Interview
                </button>

                <button
                  onClick={() => navigate("/interview")}
                  className="rounded-xl border border-slate-700 bg-slate-900/70 px-6 py-3 font-semibold text-slate-300 transition hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400"
                >
                  📄 Practice With Resume
                </button>

              </div>
            </div>

            {/* Score Highlight */}
            <div className="flex shrink-0 items-center justify-center">
              <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border border-blue-500/30 bg-slate-950/70 shadow-2xl shadow-blue-900/20">
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Avg. Score
                </p>

                <p className="mt-1 text-4xl font-bold text-blue-400">
                  {averageScore}
                </p>

                <p className="text-sm text-slate-600">
                  out of 10
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ======================================
            STAT CARDS
        ====================================== */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Interviews */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-slate-700">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Interviews
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {totalInterviews}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-xl">
                🎯
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-600">
              Practice sessions completed
            </p>
          </div>

          {/* Average */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-slate-700">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Average Score
                </p>

                <h2 className="mt-2 text-3xl font-bold text-blue-400">
                  {averageScore}
                  <span className="ml-1 text-sm text-slate-600">
                    /10
                  </span>
                </h2>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-xl">
                📊
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-600">
              Across all interviews
            </p>
          </div>

          {/* Best Score */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-slate-700">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Best Score
                </p>

                <h2 className="mt-2 text-3xl font-bold text-emerald-400">
                  {bestScore}
                  <span className="ml-1 text-sm text-slate-600">
                    /10
                  </span>
                </h2>
              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3 text-xl">
                🏆
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-600">
              Your highest performance
            </p>
          </div>

          {/* Questions */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-slate-700">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Questions Answered
                </p>

                <h2 className="mt-2 text-3xl font-bold text-purple-400">
                  {totalQuestions}
                </h2>
              </div>

              <div className="rounded-xl bg-purple-500/10 p-3 text-xl">
                💡
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-600">
              Questions practiced with AI
            </p>
          </div>

        </section>

        {/* ======================================
            MAIN CONTENT
        ====================================== */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ====================================
              PERFORMANCE GRAPH
          ==================================== */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">

            <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Performance Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your interview scores over time
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-500">
                Last {graphInterviews.length} interviews
              </div>

            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
              </div>
            ) : graphInterviews.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-center">
                <div className="text-4xl">
                  📈
                </div>

                <p className="mt-3 font-medium text-slate-300">
                  Your performance graph will appear here
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Complete your first interview to start
                  tracking your progress.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">

                <div className="relative h-64">

                  {/* Grid */}
                  <div className="absolute inset-0 flex flex-col justify-between">

                    {[10, 8, 6, 4, 2, 0].map(
                      (number) => (
                        <div
                          key={number}
                          className="flex items-center gap-3"
                        >
                          <span className="w-5 text-right text-[10px] text-slate-700">
                            {number}
                          </span>

                          <div className="h-px flex-1 bg-slate-800/70" />
                        </div>
                      )
                    )}

                  </div>

                  {/* Bars */}
                  <div className="absolute inset-0 flex items-end justify-around pl-8 pr-2">

                    {graphInterviews.map(
                      (item, index) => {
                        const score = Number(
                          item.overallScore || 0
                        );

                        const height =
                          getScoreHeight(score);

                        return (
                          <div
                            key={item._id || index}
                            className="flex h-full flex-1 flex-col items-center justify-end"
                          >
                            <div className="mb-2 text-xs font-semibold text-blue-400">
                              {score.toFixed(1)}
                            </div>

                            <div
                              className="w-8 max-w-[55%] rounded-t-lg bg-blue-500/80 transition-all duration-500 hover:bg-blue-400 sm:w-10"
                              style={{
                                height: `${height}%`,
                              }}
                              title={`${score.toFixed(
                                1
                              )}/10`}
                            />

                            <p className="mt-2 text-[10px] text-slate-600">
                              #{index + 1}
                            </p>
                          </div>
                        );
                      }
                    )}

                  </div>

                </div>
              </div>
            )}
          </section>

          {/* ====================================
              PERFORMANCE SUMMARY
          ==================================== */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm font-medium text-blue-400">
              Your Progress
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {performanceText}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Keep practicing consistently and focus on
              improving the areas where your scores are
              lower.
            </p>

            {/* Score meter */}
            <div className="mt-7">

              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Average performance
                </span>

                <span className="font-semibold text-blue-400">
                  {averageScore}/10
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-700"
                  style={{
                    width: `${
                      Math.min(
                        100,
                        Number(averageScore) * 10
                      )
                    }%`,
                  }}
                />
              </div>

            </div>

            {/* Quick stats */}
            <div className="mt-7 space-y-3">

              <div className="flex items-center justify-between rounded-xl bg-slate-950/70 px-4 py-3">
                <span className="text-sm text-slate-500">
                  Best Performance
                </span>

                <span className="font-semibold text-emerald-400">
                  {bestScore}/10
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950/70 px-4 py-3">
                <span className="text-sm text-slate-500">
                  Interviews
                </span>

                <span className="font-semibold text-white">
                  {totalInterviews}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950/70 px-4 py-3">
                <span className="text-sm text-slate-500">
                  Questions
                </span>

                <span className="font-semibold text-white">
                  {totalQuestions}
                </span>
              </div>

            </div>

            <button
              onClick={() => navigate("/interview")}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Improve Your Score
            </button>

          </section>
        </div>

        {/* ======================================
            RECENT INTERVIEWS
        ====================================== */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Recent Interviews
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest AI interview sessions
              </p>
            </div>

            {interviews.length > 5 && (
              <span className="text-sm text-blue-400">
                Showing latest 5
              </span>
            )}

          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
            </div>
          ) : interviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-6 py-12 text-center">

              <div className="text-4xl">
                🎤
              </div>

              <h3 className="mt-4 font-semibold text-slate-300">
                No interviews yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Start your first AI interview to see your
                results here.
              </p>

              <button
                onClick={() => navigate("/interview")}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-500"
              >
                Start Interview
              </button>

            </div>
          ) : (
            <div className="space-y-3">

              {interviews.slice(0, 5).map((item) => {

                const score = Number(
                  item.overallScore || 0
                );

                return (
                  <div
                    key={item._id}
                    className="group flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-blue-500/30 hover:bg-slate-950 sm:flex-row sm:items-center sm:justify-between"
                  >

                    {/* Interview Info */}
                    <div className="min-w-0">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-lg">
                          💼
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate font-semibold text-white">
                            {item.jobRole}
                          </h3>

                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">

                            <span>
                              {item.experience}
                            </span>

                            <span>
                              •
                            </span>

                            <span>
                              {item.difficulty}
                            </span>

                            <span>
                              •
                            </span>

                            <span>
                              {new Date(
                                item.createdAt
                              ).toLocaleDateString()}
                            </span>

                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Score + Button */}
                    <div className="flex items-center justify-between gap-5 sm:justify-end">

                      <div className="text-right">

                        <p
                          className={`text-xl font-bold ${
                            score >= 8
                              ? "text-emerald-400"
                              : score >= 6
                              ? "text-blue-400"
                              : "text-amber-400"
                          }`}
                        >
                          {score.toFixed(1)}
                          <span className="text-sm text-slate-600">
                            /10
                          </span>
                        </p>

                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Score
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            "/interview/" +
                              item._id
                          )
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        View Result
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* ======================================
            QUICK ACTIONS
        ====================================== */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">

          <button
            onClick={() => navigate("/interview")}
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-blue-500/30 hover:bg-blue-500/5"
          >
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                🎤
              </div>

              <div>
                <h3 className="font-semibold">
                  Start AI Interview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Practice 10 AI-generated questions.
                </p>
              </div>

            </div>
          </button>

          <button
            onClick={() => navigate("/interview")}
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-purple-500/30 hover:bg-purple-500/5"
          >
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
                📄
              </div>

              <div>
                <h3 className="font-semibold">
                  Resume-Based Practice
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Upload your resume and practice
                  personalized questions.
                </p>
              </div>

            </div>
          </button>

        </section>

        {/* ======================================
            FOOTER
        ====================================== */}
        <footer className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-5">

          <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

            <p className="text-sm text-slate-500">
              Keep practicing to improve your interview
              performance.
            </p>

            <button
              onClick={() => navigate("/interview")}
              className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              Practice Again →
            </button>

          </div>

        </footer>

      </div>
    </div>
  );
}

export default Dashboard;