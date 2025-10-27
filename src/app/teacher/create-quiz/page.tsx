"use client";
import { useState } from "react";
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";

export default function QuizCreator() {
  const [quizTitle, setQuizTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      expanded: true,
    },
  ]);

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      expanded: true,
    };
    setQuestions([...questions, newQuestion]);

    // Scroll to bottom after adding
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const deleteQuestion = (id: Number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: Number, field: any, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (id: Number, optionIndex: any, value: any) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const toggleExpanded = (id: Number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, expanded: !q.expanded } : q))
    );
  };

  const handleSave = async () => {
    const quizData = {
      title: quizTitle,
      totalTime: timeLimit,
      questions: questions.map((q) => ({
        mainQuestion: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    };
    console.log("Quiz Data:", JSON.stringify(quizData, null, 2));

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData, null, 2),
      });

      const data = await res.json();
      console.log("Response from server", data);
    } catch (err) {
      console.error(err);
    }

    alert("Quiz saved! Check console for data.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Quiz</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                style={{ borderColor: "#1e00ff20" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="e.g., 60"
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              {questions.length}{" "}
              {questions.length === 1 ? "question" : "questions"}
            </p>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all"
              style={{ backgroundColor: "#1e00ff" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1700cc")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#1e00ff")
              }
            >
              <Save className="w-4 h-4" />
              Save Quiz
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Question Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpanded(q.id)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: "#1e00ff" }}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-700">
                    {q.question || "New Question"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(q.id);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {q.expanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Question Details */}
              {q.expanded && (
                <div className="p-6 pt-2 border-t space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <textarea
                      value={q.question}
                      onChange={(e) =>
                        updateQuestion(q.id, "question", e.target.value)
                      }
                      placeholder="Enter your question..."
                      rows={2}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    <div className="space-y-2">
                      {q.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswer === optIndex}
                            onChange={() =>
                              updateQuestion(q.id, "correctAnswer", optIndex)
                            }
                            className="w-4 h-4"
                            style={{ accentColor: "#1e00ff" }}
                          />
                          <span className="text-sm font-medium text-gray-600 w-6">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(q.id, optIndex, e.target.value)
                            }
                            placeholder={`Option ${String.fromCharCode(
                              65 + optIndex
                            )}`}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Select the radio button to mark the correct answer
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <button
          onClick={addQuestion}
          className="w-full mt-6 py-4 border-2 border-dashed rounded-xl text-gray-600 font-medium hover:bg-white hover:border-solid transition-all flex items-center justify-center gap-2"
          style={{ borderColor: "#1e00ff40" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#1e00ff";
            e.currentTarget.style.color = "#1e00ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#1e00ff40";
            e.currentTarget.style.color = "#6b7280";
          }}
        >
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      </div>
    </div>
  );
}
