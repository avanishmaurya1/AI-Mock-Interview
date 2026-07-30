 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get("/interview");
        setInterviews(res.data.interviews || []);
      } catch (error) {
        console.error("Failed to fetch interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const averageScore = interviews.length
    ? (
        interviews.reduce(
          (sum, item) => sum + Number(item.overallScore || 0),
          0
        ) / interviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-400">
              Interview Dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome, {user?.name || "User"}
            </h1>

            <p className="mt-2 text-slate-400">
              Track your interview practice and improve your performance.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
          >
            Logout
          </button>
        </div>

        {/* Main Section */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Start Interview */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/15 via-slate-900 to-slate-900 p-7">
            <div className="mb-6 h-1 w-12 rounded-full bg-blue-500" />

            <h2 className="text-2xl font-bold">
              Start a New Interview
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Practice role-specific interview questions and receive
              detailed feedback on your answers.
            </p>

            <button
              onClick={() => navigate("/interview")}
              className="mt-7 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Start Interview
            </button>
          </div>

          {/* Recent Interviews */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Recent Interviews
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest interview sessions
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
              </div>
            ) : interviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-6 py-12 text-center">
                <h3 className="font-semibold text-slate-300">
                  No interviews yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Start your first interview to see your results here.
                </p>

                <button
                  onClick={() => navigate("/interview")}
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-500"
                >
                  Start Interview
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {item.jobRole}
                      </h3>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
                        <span>{item.experience}</span>
                        <span>|</span>
                        <span>{item.difficulty}</span>
                        <span>|</span>
                        <span>
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-400">
                          {Number(
                            item.overallScore || 0
                          ).toFixed(1)}
                          <span className="text-sm text-slate-600">
                            /10
                          </span>
                        </p>

                        <p className="text-xs text-slate-600">
                          Score
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            "/interview/" + item._id
                          )
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Total Interviews
            </p>

            <h3 className="mt-2 text-3xl font-bold text-white">
              {interviews.length}
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Practice sessions completed
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Average Score
            </p>

            <h3 className="mt-2 text-3xl font-bold text-blue-400">
              {averageScore}
              <span className="ml-1 text-base text-slate-600">
                /10
              </span>
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Across all interviews
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Performance
            </p>

            <h3 className="mt-2 text-3xl font-bold text-white">
              {interviews.length
                ? Number(averageScore) >= 8
                  ? "Excellent"
                  : Number(averageScore) >= 6
                  ? "Good"
                  : "Keep Practicing"
                : "Not Rated"}
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Based on your average score
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Keep practicing to improve your interview performance.
            </p>

            <button
              onClick={() => navigate("/interview")}
              className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              Practice Again
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;