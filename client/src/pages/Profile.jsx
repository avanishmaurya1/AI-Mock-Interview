 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
      }
    }

    const fetchInterviews = async () => {
      try {
        const res = await API.get("/interview");

        setInterviews(res.data.interviews || []);
      } catch (error) {
        console.error("Failed to load interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const averageScore = interviews.length
    ? (
        interviews.reduce(
          (sum, item) => sum + (item.overallScore || 0),
          0
        ) / interviews.length
      ).toFixed(1)
    : "0.0";

  const bestScore = interviews.length
    ? Math.max(
        ...interviews.map((item) => item.overallScore || 0)
      ).toFixed(1)
    : "0.0";

  const getPerformance = () => {
    const score = Number(averageScore);

    if (!interviews.length) {
      return "Not Rated";
    }

    if (score >= 8) {
      return "Excellent";
    }

    if (score >= 6) {
      return "Good";
    }

    if (score >= 4) {
      return "Developing";
    }

    return "Keep Practicing";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Profile
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your account and review your interview progress.
          </p>
        </div>


        {/* ================= PROFILE CARD ================= */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* User Information */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 lg:col-span-1">

            <div className="flex flex-col items-center text-center">

              {/* Initial */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-3xl font-bold text-blue-400">
                {(user?.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                {user?.name || "User"}
              </h2>

              <p className="mt-2 break-all text-sm text-slate-400">
                {user?.email || "No email available"}
              </p>

              <div className="mt-6 w-full border-t border-slate-800 pt-6 text-left">

                <div className="mb-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Name
                  </p>

                  <p className="mt-1 font-medium text-slate-200">
                    {user?.name || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium text-slate-200">
                    {user?.email || "Not available"}
                  </p>
                </div>

              </div>

              <button
                onClick={handleLogout}
                className="mt-7 w-full rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
              >
                Logout
              </button>

            </div>
          </div>


          {/* Performance Overview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 lg:col-span-2">

            <div className="mb-7">
              <h2 className="text-2xl font-bold">
                Performance Overview
              </h2>

              <p className="mt-2 text-slate-500">
                Your interview practice statistics.
              </p>
            </div>


            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Total */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm text-slate-500">
                    Total Interviews
                  </p>

                  <p className="mt-3 text-3xl font-bold text-white">
                    {interviews.length}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Completed practice sessions
                  </p>
                </div>


                {/* Average */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm text-slate-500">
                    Average Score
                  </p>

                  <p className="mt-3 text-3xl font-bold text-blue-400">
                    {averageScore}
                    <span className="ml-1 text-base text-slate-600">
                      /10
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Across all interviews
                  </p>
                </div>


                {/* Best */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm text-slate-500">
                    Best Score
                  </p>

                  <p className="mt-3 text-3xl font-bold text-white">
                    {bestScore}
                    <span className="ml-1 text-base text-slate-600">
                      /10
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Your highest result
                  </p>
                </div>


                {/* Performance */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm text-slate-500">
                    Current Performance
                  </p>

                  <p className="mt-3 text-2xl font-bold text-blue-400">
                    {getPerformance()}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Based on average score
                  </p>
                </div>

              </div>
            )}


            {/* CTA */}
            <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">

              <h3 className="font-semibold text-white">
                Want to improve your score?
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Start another interview and use the feedback from
                previous sessions to improve your answers.
              </p>

              <button
                onClick={() => navigate("/interview")}
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Start New Interview
              </button>

            </div>

          </div>
        </div>


        {/* ================= RECENT ACTIVITY ================= */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-7">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Recent Activity
            </h2>

            <p className="mt-2 text-slate-500">
              Your latest interview sessions.
            </p>
          </div>


          {loading ? (
            <div className="py-8 text-center text-slate-500">
              Loading activity...
            </div>
          ) : interviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 px-6 py-10 text-center">
              <p className="font-medium text-slate-300">
                No interview activity yet
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Complete your first interview to see activity here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">

              {interviews.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>
                    <h3 className="font-semibold text-white">
                      {item.jobRole}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.experience} · {item.difficulty}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString()
                        : "Date unavailable"}
                    </p>
                  </div>


                  <div className="flex items-center gap-4">

                    <div className="text-right">
                      <p className="font-bold text-blue-400">
                        {Number(
                          item.overallScore || 0
                        ).toFixed(1)}
                        /10
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
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-500/50 hover:text-blue-400"
                    >
                      View
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>


        {/* ================= FOOTER ================= */}
        <div className="py-8 text-center text-sm text-slate-600">
          Keep practicing and improve one interview at a time.
        </div>

      </div>
    </div>
  );
}

export default Profile;