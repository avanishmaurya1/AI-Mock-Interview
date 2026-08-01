 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Interview() {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [interviewId, setInterviewId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState([]);

  const [formData, setFormData] = useState({
    jobRole: "",
    experience: "Fresher",
    difficulty: "Easy",
  });

  // =========================
  // Form Change
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Start Interview
  // =========================
  const startInterview = async (e) => {
    e.preventDefault();

    if (!formData.jobRole.trim()) {
      alert("Please enter a job role.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/interview/", formData);

      if (!res.data.success) {
        throw new Error(
          res.data.message || "Failed to create interview."
        );
      }

      const interview = res.data.interview;

      setInterviewId(interview._id);
      setQuestions(interview.questions || []);
      setCurrentQuestion(0);
      setAnswer("");
      setResults([]);
      setStarted(true);
    } catch (error) {
      console.error("START INTERVIEW ERROR:", error);

      alert(
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
      alert("Please write your answer before submitting.");
      return;
    }

    const question = questions[currentQuestion];

    if (!question?._id) {
      alert("Question ID not found.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await API.post(
        `/interview/${interviewId}/answer`,
        {
          questionId: question._id,
          answer: answer.trim(),
        }
      );

      if (!res.data.success) {
        throw new Error(
          res.data.message || "Failed to evaluate answer."
        );
      }

      const evaluation = res.data.question;

      setResults((prev) => [
        ...prev,
        {
          question: evaluation.question,
          answer: evaluation.answer,
          score: evaluation.score,
          feedback: evaluation.feedback,
          correctAnswer: evaluation.correctAnswer,
          improvement: evaluation.improvement,
        },
      ]);

      setAnswer("");

      // More questions available
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // Interview completed
        navigate(`/interview/${interviewId}`);
      }
    } catch (error) {
      console.error("SUBMIT ANSWER ERROR:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to evaluate answer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // Start Screen
  // =========================
  if (!started) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl">

          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-400">
              AI Mock Interview
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Practice Like a Real Interview
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Choose your role and difficulty. Our AI will generate
              interview questions and evaluate your answers.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">

            <form onSubmit={startInterview} className="space-y-6">

              {/* Job Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Job Role
                </label>

                <input
                  type="text"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Experience
                </label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 Years">0-1 Years</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Difficulty
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          difficulty: level,
                        })
                      }
                      className={`rounded-xl border px-4 py-3 font-medium transition ${
                        formData.difficulty === level
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Generating Interview..."
                  : "Start AI Interview"}
              </button>

            </form>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Safety
  // =========================
  if (!questions.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            No questions found
          </h2>

          <button
            onClick={() => setStarted(false)}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Start Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  // =========================
  // Interview Screen
  // =========================
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-blue-400">
              AI MOCK INTERVIEW
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              {formData.jobRole}
            </h1>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2">
            <span className="text-sm text-slate-400">
              Question
            </span>

            <span className="ml-2 font-bold">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>

        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">

          <div className="mb-6">
            <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              Question {currentQuestion + 1}
            </span>

            <h2 className="mt-5 text-2xl font-bold leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Answer */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Your Answer
            </label>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={9}
              placeholder="Type your answer here..."
              disabled={submitting}
              className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            />
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={submitAnswer}
              disabled={submitting || !answer.trim()}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "AI Evaluating..."
                : currentQuestion === questions.length - 1
                ? "Finish Interview"
                : "Submit & Next"}
            </button>
          </div>

        </div>

        {/* Info */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">
          💡 Give a clear and structured answer. The AI will evaluate
          your response based on relevance, accuracy and quality.
        </div>

      </div>
    </div>
  );
}

export default Interview;