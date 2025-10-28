"use client";
import { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, Send } from "lucide-react";

export default function QuizApp() {
  // Quiz state (initialize with safe defaults)
  const [quiz, setQuiz] = useState<{
    title: string;
    timeLimit: number;
    questions: any[];
  }>({
    title: "",
    timeLimit: 0,
    questions: [],
  });

  const rawQuiz = useRef(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string | number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch quiz data on mount and initialize quiz + timer
  useEffect(() => {
    let mounted = true;

    const fetchdata = async () => {
      try {
        const quiz_data = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get-data" }),
        });
        if (!quiz_data.ok) throw new Error(`Fetch failed: ${quiz_data.status}`);
        const data = await quiz_data.json();

        rawQuiz.current = data;
        console.log(rawQuiz.current);

        if (!mounted) return;

        const parsed = {
          title: data.values?.testName || "Untitled Quiz",
          timeLimit: Number(data.values?.totalTime) || 0,
          questions: (data.values?.questionRef || []).map(
            (individualQ: any, idx: number) => ({
              id: individualQ._id ?? idx,
              question: individualQ.questionText ?? "",
              options: individualQ.options ?? [],
            })
          ),
        };

        setQuiz(parsed);
        // initialize timeLeft from fetched timeLimit (in minutes -> seconds)
        setTimeLeft(parsed.timeLimit * 60);
        setLoading(false);
      } catch (err: any) {
        console.error(`Error fetching quiz: ${err}`);
        setLoading(false);
      }
    };

    fetchdata();

    return () => {
      mounted = false;
    };
  }, []);

  // Timer: start only after quiz has been loaded
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async () => {
    const attempted = Object.keys(answers).length;
    console.log(rawQuiz.current);
    alert(
      `Quiz submitted!\nAttempted: ${attempted}/${quiz.questions.length} questions`
    );

    console.log("Answers:", answers);
  };

  const attemptedCount = Object.keys(answers || {}).length;
  const currentQ = quiz.questions?.[currentQuestion];
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Loading quiz…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Quiz Area */}
          <div className="flex-1">
            {/* Quiz Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Time Remaining: {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <span
                  className="inline-block px-3 py-1 rounded-full text-white text-sm font-medium mb-4"
                  style={{ backgroundColor: "#1e00ff" }}
                >
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </span>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentQ.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQ.id, index)}
                    className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                      answers?.[currentQ.id] === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    style={
                      answers?.[currentQ.id] === index
                        ? {
                            borderColor: "#1e00ff",
                            backgroundColor: "#1e00ff10",
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                          answers?.[currentQ.id] === index
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                        style={
                          answers?.[currentQ.id] === index
                            ? { backgroundColor: "#1e00ff" }
                            : {}
                        }
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() =>
                    setCurrentQuestion(Math.max(0, currentQuestion - 1))
                  }
                  disabled={currentQuestion === 0}
                  className="px-6 py-2.5 rounded-lg border-2 border-gray-300 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentQuestion(
                      Math.min(quiz.questions.length - 1, currentQuestion + 1)
                    )
                  }
                  disabled={currentQuestion === quiz.questions.length - 1}
                  className="px-6 py-2.5 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#1e00ff" }}
                  onMouseEnter={(e) => {
                    if (currentQuestion < quiz.questions.length - 1) {
                      e.currentTarget.style.backgroundColor = "#1700cc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1e00ff";
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quiz Progress
              </h3>

              {/* Progress Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Attempted
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: "#1e00ff" }}
                  >
                    {attemptedCount}/{quiz.questions.length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Remaining
                  </span>
                  <span className="text-lg font-bold text-gray-700">
                    {quiz.questions.length - attemptedCount}
                  </span>
                </div>
              </div>

              {/* Question Grid */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Questions
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {quiz.questions.map((q, index) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestion(index)}
                      className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                        currentQuestion === index ? "ring-2 ring-blue-500" : ""
                      }`}
                      style={{
                        backgroundColor:
                          answers?.[q.id] !== undefined ? "#1e00ff" : "#e5e7eb",
                        color:
                          answers?.[q.id] !== undefined ? "white" : "#6b7280",
                        ...(currentQuestion === index && {
                          ringColor: "#1e00ff",
                        }),
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: "#1e00ff" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1700cc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e00ff")
                }
              >
                <Send className="w-4 h-4" />
                Submit Quiz
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                You can submit anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
4;
