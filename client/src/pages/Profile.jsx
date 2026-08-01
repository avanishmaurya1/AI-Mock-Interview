import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your account information and interview activity.
          </p>
        </div>

        {/* Profile Card */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* User Avatar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-col items-center text-center">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold shadow-lg shadow-blue-600/20">
                {(user.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                {user.name || "User"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                AI Mock Interview Candidate
              </p>

            </div>
          </div>

          {/* Account Information */}
          <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-bold">
              Account Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-slate-500">
                  Full Name
                </p>

                <p className="mt-1 text-lg font-medium text-slate-200">
                  {user.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Email Address
                </p>

                <p className="mt-1 text-lg font-medium text-slate-200">
                  {user.email || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Account Status
                </p>

                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Active
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-bold">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Continue practicing or review your previous interviews.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <button
              onClick={() => navigate("/interview")}
              className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-left transition hover:border-blue-500 hover:bg-blue-500/5"
            >
              <div className="text-2xl">🎯</div>

              <h3 className="mt-3 font-semibold">
                Start Interview
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Practice with AI-generated questions.
              </p>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-left transition hover:border-blue-500 hover:bg-blue-500/5"
            >
              <div className="text-2xl">📊</div>

              <h3 className="mt-3 font-semibold">
                View Dashboard
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Check your interview performance.
              </p>
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-left transition hover:border-red-500/50 hover:bg-red-500/5"
            >
              <div className="text-2xl">🚪</div>

              <h3 className="mt-3 font-semibold">
                Logout
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Sign out from your account.
              </p>
            </button>

          </div>
        </div>

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 text-sm font-medium text-blue-400 transition hover:text-blue-300"
        >
          ← Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default Profile;