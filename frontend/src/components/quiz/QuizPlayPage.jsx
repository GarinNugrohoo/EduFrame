import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ClockIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FlagIcon,
  MenuIcon,
  XIcon,
} from "../icons/IkonWrapper";

const QuizPlayPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [showQuestionNavigator, setShowQuestionNavigator] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Generate 30 dummy questions
  const generateQuestions = () => {
    const questions = [];
    const topics = [
      "Persamaan Kuadrat",
      "Fungsi Linier",
      "Geometri",
      "Aljabar",
      "Trigonometri",
      "Statistika",
    ];

    for (let i = 1; i <= 30; i++) {
      const topic = topics[i % topics.length];
      questions.push({
        id: i,
        question_text: `Soal ${i}: Contoh pertanyaan tentang ${topic}?`,
        option_a: `Opsi A untuk soal ${i}`,
        option_b: `Opsi B untuk soal ${i}`,
        option_c: `Opsi C untuk soal ${i}`,
        option_d: `Opsi D untuk soal ${i}`,
        correct_answer: ["A", "B", "C", "D"][i % 4],
        explanation: `Penjelasan untuk soal ${i} tentang ${topic}`,
        points: 10,
        topic: topic,
        difficulty: i <= 10 ? "Mudah" : i <= 20 ? "Sedang" : "Sulit",
      });
    }
    return questions;
  };

  const dummyQuestions = generateQuestions();

  useEffect(() => {
    // Simulasi load quiz
    setTimeout(() => {
      setQuizData({
        id: quizId,
        title: "Matematika Lanjutan - Ujian Komprehensif",
        description: "Tes komprehensif dengan 30 soal berbagai topik",
        total_questions: dummyQuestions.length,
        total_points: dummyQuestions.reduce((sum, q) => sum + q.points, 0),
        duration_minutes: 30,
        category: "Matematika",
        difficulty: "Mixed",
      });
      setLoading(false);
    }, 800);

    // Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizId]);

  const handleAnswer = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
    setShowQuestionNavigator(false);
  };

  const handleNext = () => {
    if (currentQuestion < dummyQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleFlagQuestion = (questionId) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleAutoSubmit = () => {
    let correct = 0;
    dummyQuestions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        correct++;
      }
    });

    const result = {
      quizId: quizId,
      score: Math.round((correct / dummyQuestions.length) * 100),
      total_questions: dummyQuestions.length,
      correct_answers: correct,
      time_spent_seconds: 1800 - timeLeft,
      completed_at: new Date().toISOString(),
      is_auto_submit: true,
    };

    saveResult(result);
    navigate(`/quiz/${quizId}/result`, { state: { result } });
  };

  const checkSubmitConditions = () => {
    const unansweredQuestions =
      dummyQuestions.length - answers.filter(Boolean).length;

    if (unansweredQuestions === 0) {
      setSubmitMessage(
        "Semua soal sudah terjawab. Anda yakin ingin mengumpulkan?",
      );
    } else {
      setSubmitMessage(
        `Masih ada ${unansweredQuestions} soal yang belum dijawab. Anda yakin ingin mengumpulkan?`,
      );
    }

    setShowSubmitModal(true);
  };

  const handleSubmit = () => {
    if (!quizData) return;

    // Hitung score
    let correct = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    dummyQuestions.forEach((q, index) => {
      totalPoints += q.points;
      if (answers[index] === q.correct_answer) {
        correct++;
        earnedPoints += q.points;
      }
    });

    const result = {
      quizId: quizId,
      score: Math.round((correct / dummyQuestions.length) * 100),
      total_questions: dummyQuestions.length,
      correct_answers: correct,
      total_points: totalPoints,
      earned_points: earnedPoints,
      time_spent_seconds: 1800 - timeLeft,
      completed_at: new Date().toISOString(),
      flagged_questions: Array.from(flaggedQuestions),
    };

    saveResult(result);
    navigate(`/quiz/${quizId}/result`, { state: { result } });
  };

  const saveResult = (result) => {
    const subjectId = 1;
    const saved = localStorage.getItem(`quiz_results_${subjectId}`);
    const results = saved ? JSON.parse(saved) : {};
    results[quizId] = result;
    localStorage.setItem(`quiz_results_${subjectId}`, JSON.stringify(results));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getTimeColor = (seconds) => {
    if (seconds <= 300) return "text-red-600";
    if (seconds <= 600) return "text-amber-600";
    return "text-gray-700";
  };

  const getQuestionStatus = (index) => {
    if (answers[index]) return "answered";
    if (flaggedQuestions.has(dummyQuestions[index].id)) return "flagged";
    return "unanswered";
  };

  const handleExitAttempt = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    const tempProgress = {
      quizId,
      currentQuestion,
      answers,
      timeLeft,
      flaggedQuestions: Array.from(flaggedQuestions),
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(
      `quiz_progress_${quizId}`,
      JSON.stringify(tempProgress),
    );

    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-xs">
          <div className="w-14 h-14 border-3 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-base font-medium text-gray-900 mb-1">
            Memuat Kuis
          </h3>
          <p className="text-sm text-gray-600">Menyiapkan 30 soal...</p>
        </div>
      </div>
    );
  }

  const currentQ = dummyQuestions[currentQuestion];
  const totalQuestions = dummyQuestions.length;
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
  const answeredCount = answers.filter(Boolean).length;
  const isAllAnswered = answeredCount === totalQuestions;

  return (
    <div className="min-h-screen bg-gray-50 safe-area-padding">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0 px-2">
              <h1 className="text-sm font-semibold text-gray-900 truncate text-center">
                {quizData?.title}
              </h1>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <span>
                  {answeredCount}/{totalQuestions} terjawab
                </span>
                <span>•</span>
                <span>{quizData?.difficulty}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`flex items-center gap-1 font-semibold ${getTimeColor(timeLeft)}`}
              >
                <ClockIcon className="w-4 h-4" />
                <span className="tabular-nums text-sm">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={() => setShowQuestionNavigator(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MenuIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                Soal {currentQuestion + 1} dari {totalQuestions}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-red-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-32">
        {/* Question Card */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-50 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-red-700">
                    {currentQuestion + 1}
                  </span>
                </div>
                <div className="text-xs">
                  <div className="text-gray-700 font-medium">
                    {currentQ.topic}
                  </div>
                  <div className="text-gray-500">
                    {currentQ.difficulty} • {currentQ.points} poin
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleFlagQuestion(currentQ.id)}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                  flaggedQuestions.has(currentQ.id)
                    ? "bg-red-50 text-red-600"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FlagIcon className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-base font-medium text-gray-900 leading-relaxed break-words">
              {currentQ.question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="p-3">
            <div className="space-y-2">
              {["A", "B", "C", "D"].map((option) => {
                const optionText = currentQ[`option_${option.toLowerCase()}`];
                const isSelected = answers[currentQuestion] === option;

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-150 ${
                      isSelected
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    } active:scale-[0.99]`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span className="font-semibold text-sm">{option}</span>
                      </div>
                      <span className="text-sm text-gray-900 flex-1 break-words">
                        {optionText}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
        <div className="flex flex-col">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                currentQuestion === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Sebelumnya</span>
            </button>

            <div className="text-xs text-gray-600 px-2">
              {currentQuestion + 1}/{totalQuestions}
            </div>

            <button
              onClick={handleNext}
              disabled={currentQuestion === totalQuestions - 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                currentQuestion === totalQuestions - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-sm font-medium">Selanjutnya</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Submit Button */}
          <div className="px-4 pb-3 pt-2 border-t border-gray-100">
            <button
              onClick={checkSubmitConditions}
              className={`w-full py-3 rounded-lg font-medium text-sm transition-colors ${
                isAllAnswered
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              {isAllAnswered ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Semua Terjawab • Kumpulkan</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Kumpulkan • </span>
                  <span>{totalQuestions - answeredCount} belum dijawab</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Question Navigator */}
      {showQuestionNavigator && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[80vh] flex flex-col animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Navigasi Soal
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {answeredCount} dari {totalQuestions} terjawab
                  </p>
                </div>
                <button
                  onClick={() => setShowQuestionNavigator(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XIcon className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-5 gap-3">
                {dummyQuestions.map((question, index) => {
                  const status = getQuestionStatus(index);
                  const isCurrent = index === currentQuestion;
                  const isAnswered = answers[index];

                  let bgColor = "bg-gray-100";
                  let borderColor = "border-gray-200";
                  let textColor = "text-gray-700";

                  if (isCurrent) {
                    bgColor = "bg-red-100";
                    borderColor = "border-red-300";
                    textColor = "text-red-700";
                  } else if (isAnswered) {
                    bgColor = "bg-green-100";
                    borderColor = "border-green-200";
                    textColor = "text-green-700";
                  } else if (status === "flagged") {
                    bgColor = "bg-red-50";
                    borderColor = "border-red-100";
                    textColor = "text-red-600";
                  }

                  return (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={`
                        aspect-square rounded-lg border ${borderColor} ${bgColor}
                        flex flex-col items-center justify-center transition-transform
                        active:scale-95 ${textColor}
                      `}
                    >
                      <span className="text-sm font-medium">{index + 1}</span>
                      {status === "flagged" && (
                        <div className="mt-1">
                          <FlagIcon className="w-3 h-3 text-red-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-gray-600">Terjawab</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-50 border border-red-100 rounded flex items-center justify-center">
                    <FlagIcon className="w-2 h-2 text-red-500" />
                  </div>
                  <span className="text-gray-600">Ditandai</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-gray-600">Saat ini</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm animate-scale-in">
            <div className="p-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XIcon className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                Keluar dari Kuis?
              </h3>
              <p className="text-sm text-gray-600 mb-6 text-center leading-relaxed">
                Progress Anda akan disimpan sementara. Anda dapat melanjutkan
                nanti dari soal ini.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Lanjutkan Kuis
                </button>
                <button
                  onClick={confirmExit}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Simpan & Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm animate-scale-in">
            <div className="p-6">
              <div
                className={`w-14 h-14 ${isAllAnswered ? "bg-green-100" : "bg-yellow-100"} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {isAllAnswered ? (
                  <CheckCircleIcon className="w-7 h-7 text-green-600" />
                ) : (
                  <span className="text-2xl">⚠️</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                {isAllAnswered ? "Kumpulkan Jawaban?" : "Periksa Kembali"}
              </h3>
              <p className="text-sm text-gray-600 mb-6 text-center leading-relaxed">
                {submitMessage}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Periksa Lagi
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Ya, Kumpulkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPlayPage;
