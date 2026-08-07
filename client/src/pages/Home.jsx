 import Clipart from "../assets/Clipart.jpg";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-[#020617]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* ================= LEFT CONTENT ================= */}
            <div className="relative z-10 max-w-3xl">

              <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
                Interview Practice Platform
              </div>

              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Prepare better.
                <span className="block text-blue-500">
                  Interview with confidence.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                Practice role-specific interview questions, evaluate your
                answers, and understand where you can improve before your
                next real interview.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/interview"
                  className="rounded-xl bg-blue-600 px-7 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                >
                  Start Interview
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl border border-slate-700 bg-slate-900 px-7 py-3.5 text-center font-semibold text-slate-200 transition hover:border-blue-500/50 hover:text-blue-400"
                >
                  Create Account
                </Link>

              </div>

            </div>


            {/* ================= RIGHT AI CLIPART ================= */}
            <div className="relative flex items-center justify-center lg:justify-end">

              {/* Blue Glow */}
              <div className="pointer-events-none absolute h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-3xl sm:h-[450px] sm:w-[450px]" />

              {/* Clipart */}
              <div className="relative z-10 w-full max-w-[650px]">

                <img
                  src={Clipart}
                  alt="AI Mock Interview Platform"
                  className="h-auto w-full object-contain drop-shadow-[0_0_45px_rgba(37,99,235,0.22)] transition-transform duration-500 hover:scale-[1.02]"
                />

              </div>

            </div>

          </div>
        </div>

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      </section>


      {/* ================= FEATURES ================= */}
      <section className="bg-[#020617]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="mb-12 max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Features
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to practice effectively
            </h2>

            <p className="mt-4 text-slate-400">
              A simple workflow designed to help you practice, review,
              and improve your interview performance.
            </p>

          </div>


          <div className="grid gap-6 md:grid-cols-3">

            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500/30">

              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-lg font-bold text-blue-400">
                01
              </div>

              <h3 className="text-xl font-semibold">
                Role-Based Questions
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Select your target job role, experience level, and
                difficulty to practice relevant interview questions.
              </p>

            </div>


            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500/30">

              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-lg font-bold text-blue-400">
                02
              </div>

              <h3 className="text-xl font-semibold">
                Answer Evaluation
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Submit your answers and receive a score with detailed
                feedback about the quality of your response.
              </p>

            </div>


            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500/30">

              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-lg font-bold text-blue-400">
                03
              </div>

              <h3 className="text-xl font-semibold">
                Performance Reports
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Review your completed interviews, scores, feedback,
                correct answers, and improvement suggestions.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="border-y border-slate-800 bg-slate-900/40">

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="mb-12 text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Simple Process
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Practice in three steps
            </h2>

          </div>


          <div className="grid gap-8 md:grid-cols-3">

            {/* Step 1 */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 font-bold text-blue-400">
                1
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Choose Your Interview
              </h3>

              <p className="mt-3 text-slate-400">
                Select your role, experience, and preferred difficulty.
              </p>

            </div>


            {/* Step 2 */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 font-bold text-blue-400">
                2
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Answer Questions
              </h3>

              <p className="mt-3 text-slate-400">
                Answer each question as you would during a real
                interview.
              </p>

            </div>


            {/* Step 3 */}
            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 font-bold text-blue-400">
                3
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Review Your Results
              </h3>

              <p className="mt-3 text-slate-400">
                Analyze your score and use the feedback to improve.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="bg-[#020617]">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">

          <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-500/10 to-slate-900 p-10 sm:p-14">

            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to practice?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Start an interview session and see how prepared you are
              for your next opportunity.
            </p>

            <Link
              to="/interview"
              className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Start Interview
            </Link>

          </div>

        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}

export default Home;
