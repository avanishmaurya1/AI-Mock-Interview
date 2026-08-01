 import { useEffect, useRef, useState } from "react";
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

  // Resume
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");

  // Voice
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);

  const [formData, setFormData] = useState({
    jobRole: "",
    interviewType: "Technical",
    experience: "Fresher",
    difficulty: "Easy",
    resumeBased: false,
  });

  // =========================
  // Voice Recognition Setup
  // =========================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setAnswer((prev) => {
          const separator =
            prev.trim().length > 0 ? " " : "";

          return (
            prev +
            separator +
            finalTranscript.trim()
          );
        });
      }
    };

    recognition.onerror = (event) => {
      console.error(
        "VOICE RECOGNITION ERROR:",
        event.error
      );

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        alert(
          "Microphone permission was denied. Please allow microphone access."
        );
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  // =========================
  // Start Voice Recording
  // =========================
  const startVoiceRecording = () => {
    if (!voiceSupported) {
      alert(
        "Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );
      return;
    }

    if (!recognitionRef.current) {
      alert("Voice recognition is not available.");
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error(
        "START VOICE ERROR:",
        error
      );
    }
  };

  // =========================
  // Stop Voice Recording
  // =========================
  const stopVoiceRecording = () => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error(
        "STOP VOICE ERROR:",
        error
      );
    }
  };

  // =========================
  // Form Change
  // =========================
  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================
  // Resume Change
  // =========================
  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      setResumeText("");
      return;
    }

    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [
      ".txt",
      ".pdf",
      ".doc",
      ".docx",
    ];

    const fileName =
      file.name.toLowerCase();

    const validFile =
      allowedTypes.includes(file.type) ||
      allowedExtensions.some((ext) =>
        fileName.endsWith(ext)
      );

    if (!validFile) {
      alert(
        "Please upload a TXT, PDF, DOC or DOCX resume."
      );

      e.target.value = "";
      setResumeFile(null);
      setResumeText("");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Resume size must be less than 5 MB."
      );

      e.target.value = "";
      setResumeFile(null);
      setResumeText("");
      return;
    }

    setResumeFile(file);

    if (
      file.type === "text/plain" ||
      fileName.endsWith(".txt")
    ) {
      try {
        const text = await file.text();
        setResumeText(text);
      } catch (error) {
        console.error(
          "RESUME READ ERROR:",
          error
        );

        setResumeText("");
      }
    } else {
      setResumeText("");
    }
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

    if (
      formData.resumeBased &&
      !resumeFile
    ) {
      alert(
        "Please upload your resume for a resume-based interview."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/interview/",
        {
          jobRole:
            formData.jobRole.trim(),

          interviewType:
            formData.interviewType,

          experience:
            formData.experience,

          difficulty:
            formData.difficulty,

          resumeBased:
            formData.resumeBased,

          resumeName:
            resumeFile?.name || "",

          resumeText:
            resumeText || "",
        }
      );

      if (!res.data.success) {
        throw new Error(
          res.data.message ||
            "Failed to create interview."
        );
      }

      const interview =
        res.data.interview;

      setInterviewId(
        interview._id
      );

      setQuestions(
        interview.questions || []
      );

      setCurrentQuestion(0);
      setAnswer("");
      setResults([]);
      setStarted(true);
    } catch (error) {
      console.error(
        "START INTERVIEW ERROR:",
        error
      );

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
      alert(
        "Please write or speak your answer before submitting."
      );
      return;
    }

    if (isListening) {
      stopVoiceRecording();
    }

    const question =
      questions[currentQuestion];

    if (!question?._id) {
      alert("Question ID not found.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await API.post(
        `/interview/${interviewId}/answer`,
        {
          questionId:
            question._id,

          answer:
            answer.trim(),
        }
      );

      if (!res.data.success) {
        throw new Error(
          res.data.message ||
            "Failed to evaluate answer."
        );
      }

      const evaluation =
        res.data.question;

      setResults((prev) => [
        ...prev,
        {
          question:
            evaluation.question,

          answer:
            evaluation.answer,

          score:
            evaluation.score,

          feedback:
            evaluation.feedback,

          correctAnswer:
            evaluation.correctAnswer,

          improvement:
            evaluation.improvement,
        },
      ]);

      setAnswer("");

      if (
        currentQuestion <
        questions.length - 1
      ) {
        setCurrentQuestion(
          (prev) => prev + 1
        );
      } else {
        navigate(
          `/interview/${interviewId}`
        );
      }
    } catch (error) {
      console.error(
        "SUBMIT ANSWER ERROR:",
        error
      );

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

          {/* Header */}
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-400">
              AI Mock Interview
            </p>

            <h1 className="text-4xl font-bold tracking-tight">
              Practice Like a Real Interview
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Choose your role, interview type,
              experience and difficulty. Our AI
              will generate questions and evaluate
              your answers.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">

            <form
              onSubmit={startInterview}
              className="space-y-6"
            >

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

              {/* Interview Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Interview Type
                </label>

                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {[
                    "Technical",
                    "HR",
                    "Behavioral",
                    "Coding",
                    "Mixed",
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData(
                          (prev) => ({
                            ...prev,
                            interviewType:
                              type,
                          })
                        )
                      }
                      className={`rounded-xl border px-4 py-3 font-medium transition ${
                        formData.interviewType ===
                        type
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500 hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Experience
                </label>

                <select
                  name="experience"
                  value={
                    formData.experience
                  }
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="Fresher">
                    Fresher
                  </option>

                  <option value="0-1 Years">
                    0-1 Years
                  </option>

                  <option value="1-3 Years">
                    1-3 Years
                  </option>

                  <option value="3-5 Years">
                    3-5 Years
                  </option>

                  <option value="5+ Years">
                    5+ Years
                  </option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Difficulty
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    "Easy",
                    "Medium",
                    "Hard",
                  ].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData(
                          (prev) => ({
                            ...prev,
                            difficulty:
                              level,
                          })
                        )
                      }
                      className={`rounded-xl border px-4 py-3 font-medium transition ${
                        formData.difficulty ===
                        level
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume Based */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    name="resumeBased"
                    checked={
                      formData.resumeBased
                    }
                    onChange={
                      handleChange
                    }
                    className="mt-1 h-4 w-4 accent-blue-600"
                  />

                  <div>
                    <p className="font-medium text-slate-200">
                      Resume-Based Interview
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Generate interview
                      questions based on
                      your resume.
                    </p>
                  </div>

                </label>

                {/* Resume Upload */}
                {formData.resumeBased && (
                  <div className="mt-5 border-t border-slate-800 pt-5">

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Upload Resume
                    </label>

                    <input
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={
                        handleResumeChange
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-500"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Supported formats:
                      TXT, PDF, DOC and
                      DOCX. Maximum size:
                      5 MB.
                    </p>

                    {resumeFile && (
                      <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">

                        <p className="text-sm font-medium text-blue-400">
                          Resume Selected
                        </p>

                        <p className="mt-1 break-all text-sm text-slate-400">
                          {resumeFile.name}
                        </p>

                      </div>
                    )}

                    {resumeFile &&
                      !resumeText &&
                      !resumeFile.name
                        .toLowerCase()
                        .endsWith(
                          ".txt"
                        ) && (
                        <p className="mt-3 text-xs text-yellow-400">
                          Resume file
                          selected. Server-side
                          resume text extraction
                          will be used for
                          PDF/DOC/DOCX
                          processing.
                        </p>
                      )}

                  </div>
                )}

              </div>

              {/* Start */}
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
            onClick={() =>
              setStarted(false)
            }
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Start Again
          </button>

        </div>

      </div>
    );
  }

  const question =
    questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

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

            <div className="mt-2 flex flex-wrap gap-2">

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                {formData.interviewType}
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                {formData.experience}
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                {formData.difficulty}
              </span>

              {formData.resumeBased && (
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  Resume Based
                </span>
              )}

            </div>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2">

            <span className="text-sm text-slate-400">
              Question
            </span>

            <span className="ml-2 font-bold">
              {currentQuestion + 1}/
              {questions.length}
            </span>

          </div>

        </div>

        {/* Progress */}
        <div className="mb-8">

          <div className="mb-2 flex justify-between text-xs text-slate-500">

            <span>
              Progress
            </span>

            <span>
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* Question Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">

          <div className="mb-6">

            <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              Question{" "}
              {currentQuestion + 1}
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
              onChange={(e) =>
                setAnswer(
                  e.target.value
                )
              }
              rows={9}
              placeholder="Type your answer here or use the microphone..."
              disabled={submitting}
              className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
            />

            {/* Voice Controls */}
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="font-medium text-slate-200">
                    Voice Answer
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Speak your answer and it
                    will be converted to text.
                  </p>

                </div>

                {voiceSupported ? (
                  <button
                    type="button"
                    onClick={
                      isListening
                        ? stopVoiceRecording
                        : startVoiceRecording
                    }
                    disabled={
                      submitting
                    }
                    className={`rounded-xl px-5 py-3 font-semibold transition ${
                      isListening
                        ? "border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        : "bg-blue-600 text-white hover:bg-blue-500"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {isListening
                      ? "Stop Recording"
                      : "Start Recording"}
                  </button>
                ) : (
                  <p className="text-sm text-yellow-400">
                    Voice input is not
                    supported in this browser.
                  </p>
                )}

              </div>

              {isListening && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">

                  <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />

                  <span className="text-sm text-red-400">
                    Listening... Speak your
                    answer clearly.
                  </span>

                </div>
              )}

            </div>

          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">

            <button
              onClick={
                submitAnswer
              }
              disabled={
                submitting ||
                !answer.trim()
              }
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "AI Evaluating..."
                : currentQuestion ===
                  questions.length - 1
                ? "Finish Interview"
                : "Submit & Next"}
            </button>

          </div>

        </div>

        {/* Info */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">
          Give a clear and structured answer.
          You can type your answer or use
          voice input. The AI will evaluate
          your response based on relevance,
          accuracy and quality.
        </div>

      </div>

    </div>
  );
}

export default Interview;