import React, { useState, useEffect, useRef } from "react";
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
import quizApi from "../../api/quiz";

const QuizPlayPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shortAnswers, setShortAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [showQuestionNavigator, setShowQuestionNavigator] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const calculateTimeLeft = () => {
    if (!startTimeRef.current || !quizData) return 0;
    const now = new Date();
    const elapsedSeconds = Math.floor(
      (now - new Date(startTimeRef.current)) / 1000,
    );
    const totalSeconds = (quizData.duration_minutes || 30) * 60;
    return Math.max(0, totalSeconds - elapsedSeconds);
  };

  useEffect(() => {
    fetchQuizData();
    const savedProgress = localStorage.getItem(`quiz_progress_${quizId}`);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.quizId === quizId) {
          setCurrentQuestion(progress.currentQuestion || 0);
          setAnswers(progress.answers || {});
          setShortAnswers(progress.shortAnswers || {});
          if (progress.flaggedQuestions) {
            setFlaggedQuestions(new Set(progress.flaggedQuestions));
          }
          if (progress.startTime && quizData) {
            const now = new Date();
            const startTime = new Date(progress.startTime);
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const totalSeconds = (quizData.duration_minutes || 30) * 60;
            setTimeLeft(Math.max(0, totalSeconds - elapsedSeconds));
          }
        }
      } catch (error) {
        console.error("Error loading saved progress:", error);
      }
    }
  }, [quizId]);

  useEffect(() => {
    if (!quizData) return;

    if (!startTimeRef.current) {
      const savedProgress = localStorage.getItem(`quiz_progress_${quizId}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        if (progress.startTime) {
          startTimeRef.current = progress.startTime;
        } else {
          startTimeRef.current = new Date().toISOString();
          saveProgress();
        }
      } else {
        startTimeRef.current = new Date().toISOString();
        saveProgress();
      }
    }

    timerRef.current = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleAutoSubmit();
      }
      if (remaining > 0 && remaining % 30 === 0) {
        saveProgress();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizData]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const result = await quizApi.getQuizWithQuestions(quizId);

      if (result.success) {
        const data = result.data;
        setQuizData(data);

        const formattedQuestions = (data.questions || []).map(
          (question, index) => {
            const questionType = question.question_type || "multiple_choice";
            let options = [];

            // Parse options berdasarkan format database Anda
            if (question.options && Array.isArray(question.options)) {
              options = question.options;
            } else if (
              question.options &&
              typeof question.options === "string"
            ) {
              try {
                options = JSON.parse(question.options);
              } catch (e) {
                console.error("Error parsing options:", e);
                options = ["Option 1", "Option 2", "Option 3", "Option 4"];
              }
            } else {
              options = ["Option 1", "Option 2", "Option 3", "Option 4"];
            }

            return {
              id: question.id || index,
              question_text: question.question_text || `Soal ${index + 1}`,
              options: options,
              correct_answer: question.correct_answer || "",
              explanation: question.explanation || "",
              points: question.points || 1,
              topic: question.topic || "Umum",
              difficulty: question.difficulty || "Medium",
              question_type: questionType,
            };
          },
        );

        setQuestions(formattedQuestions);
        const initialAnswers = {};
        const initialShortAnswers = {};
        formattedQuestions.forEach((q, index) => {
          initialAnswers[index] = null;
          initialShortAnswers[index] = "";
        });
        setAnswers(initialAnswers);
        setShortAnswers(initialShortAnswers);
      } else {
        navigate("/quiz", { state: { error: result.message } });
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      navigate("/quiz", { state: { error: "Gagal memuat kuis" } });
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = () => {
    try {
      if (!startTimeRef.current) {
        startTimeRef.current = new Date().toISOString();
      }
      const progress = {
        quizId,
        currentQuestion,
        answers,
        shortAnswers,
        timeLeft,
        startTime: startTimeRef.current,
        flaggedQuestions: Array.from(flaggedQuestions),
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(`quiz_progress_${quizId}`, JSON.stringify(progress));
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleAnswer = (questionIndex, selectedOption) => {
    const newAnswers = { ...answers };
    newAnswers[questionIndex] = selectedOption;
    setAnswers(newAnswers);
    setTimeout(saveProgress, 500);
  };

  const handleShortAnswer = (questionIndex, value) => {
    const newShortAnswers = { ...shortAnswers };
    newShortAnswers[questionIndex] = value;
    setShortAnswers(newShortAnswers);
    setTimeout(saveProgress, 500);
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
    setShowQuestionNavigator(false);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
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
    setTimeout(saveProgress, 100);
  };

  const handleAutoSubmit = () => {
    handleSubmit(true);
  };

  const checkSubmitConditions = () => {
    const answeredQuestions =
      Object.values(answers).filter(Boolean).length +
      Object.values(shortAnswers).filter((v) => v.trim()).length;
    const unansweredQuestions = questions.length - answeredQuestions;

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

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!quizData || questions.length === 0) return;

    try {
      let correct = 0;
      let totalPoints = 0;
      let earnedPoints = 0;
      const answersArray = [];

      questions.forEach((question, index) => {
        let selectedAnswer;
        let isCorrect = false;

        if (question.question_type === "short_answer") {
          selectedAnswer = shortAnswers[index] || "";
          // Untuk short answer, bandingkan case-insensitive dan trim
          const userAnswer = selectedAnswer.trim().toLowerCase();
          const correctAnswer = (question.correct_answer || "")
            .trim()
            .toLowerCase();
          isCorrect = userAnswer === correctAnswer;
        } else {
          selectedAnswer = answers[index];

          // Untuk multiple_choice/true_false, bandingkan langsung dengan correct_answer
          if (selectedAnswer) {
            // Jika selectedAnswer adalah index (0,1,2,3), bandingkan dengan options[selectedAnswer]
            if (typeof selectedAnswer === "number") {
              const userOption = question.options[selectedAnswer] || "";
              isCorrect = userOption === question.correct_answer;
            } else {
              // Jika selectedAnswer adalah teks langsung
              isCorrect = selectedAnswer === question.correct_answer;
            }
          }
        }

        totalPoints += question.points || 1;
        if (isCorrect) {
          correct++;
          earnedPoints += question.points || 1;
        }

        // Simpan data jawaban tanpa circular reference
        answersArray.push({
          question_id: question.id,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
          points: question.points || 1,
          question_type: question.question_type,
        });
      });

      const timeSpent = (quizData.duration_minutes || 30) * 60 - timeLeft;

      const result = {
        quiz_id: parseInt(quizId),
        score: Math.round((correct / questions.length) * 100),
        total_questions: questions.length,
        correct_answers: correct,
        total_points: totalPoints,
        earned_points: earnedPoints,
        time_taken: timeSpent,
        time_spent_seconds: timeSpent,
        answers_data: JSON.stringify(answersArray),
        completed_at: new Date().toISOString(),
        is_auto_submit: isAutoSubmit,
      };

      console.log("Submitting result:", result);

      const submitResult = await quizApi.submitQuizResult(result);

      if (submitResult.success) {
        localStorage.removeItem(`quiz_progress_${quizId}`);
        navigate(`/quiz/${quizId}/result`, {
          state: {
            result: submitResult.data || result,
            quizTitle: quizData.title,
          },
        });
      } else {
        alert("Gagal mengumpulkan hasil: " + submitResult.message);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Terjadi kesalahan saat mengumpulkan hasil: " + error.message);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getTimeColor = (seconds) => {
    if (!quizData) return "text-gray-700";
    const totalSeconds = (quizData.duration_minutes || 30) * 60;
    const percentageLeft = (seconds / totalSeconds) * 100;
    if (percentageLeft <= 20) return "text-red-600";
    if (percentageLeft <= 50) return "text-amber-600";
    return "text-gray-700";
  };

  const getQuestionStatus = (index) => {
    const currentQ = questions[index];
    if (!currentQ) return "unanswered";

    if (currentQ.question_type === "short_answer") {
      return shortAnswers[index]?.trim() ? "answered" : "unanswered";
    }
    if (answers[index] !== null && answers[index] !== undefined)
      return "answered";
    if (flaggedQuestions.has(currentQ.id)) return "flagged";
    return "unanswered";
  };

  const handleExitAttempt = () => {
    saveProgress();
    setShowExitModal(true);
  };

  const confirmExit = () => {
    navigate(-1);
  };

  const renderQuestionOptions = (question) => {
    const questionType = question.question_type || "multiple_choice";

    if (questionType === "short_answer") {
      return (
        <div className="p-3">
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-2">Jawaban singkat:</div>
            <textarea
              value={shortAnswers[currentQuestion] || ""}
              onChange={(e) =>
                handleShortAnswer(currentQuestion, e.target.value)
              }
              placeholder="Ketik jawaban Anda di sini..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="text-xs text-gray-500">
              Jawab dengan singkat dan jelas. Perhatikan ejaan dan penggunaan
              huruf besar/kecil.
            </div>
          </div>
        </div>
      );
    }

    // Untuk multiple_choice dan true_false
    const options = question.options || [];

    return (
      <div className="p-3">
        <div className="space-y-2">
          {options.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected =
              answers[currentQuestion] === option ||
              answers[currentQuestion] === index;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion, option)}
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
                    <span className="font-semibold text-sm">
                      {optionLetter}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900 flex-1 break-words">
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-xs">
          <div className="w-14 h-14 border-3 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-base font-medium text-gray-900 mb-1">
            Memuat Kuis
          </h3>
          <p className="text-sm text-gray-600">Menyiapkan soal...</p>
        </div>
      </div>
    );
  }

  if (!quizData || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-2">
            Kuis Tidak Ditemukan
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Kuis tidak tersedia atau tidak memiliki soal
          </p>
          <button
            onClick={() => navigate("/quiz")}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Kembali ke Daftar Kuis
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
  const answeredCount =
    Object.values(answers).filter((v) => v !== null && v !== undefined).length +
    Object.values(shortAnswers).filter((v) => v.trim()).length;
  const isAllAnswered = answeredCount === totalQuestions;

  return (
    <div className="min-h-screen bg-gray-50 safe-area-padding">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleExitAttempt}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            </button>

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

      <div className="p-4 pb-32">
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
                    {currentQ.topic} •{" "}
                    {currentQ.question_type === "multiple_choice"
                      ? "Pilihan Ganda"
                      : currentQ.question_type === "true_false"
                        ? "Benar/Salah"
                        : "Jawaban Singkat"}
                  </div>
                  <div className="text-gray-500">
                    {currentQ.difficulty} • {currentQ.points} poin
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleFlagQuestion(currentQ.id)}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${flaggedQuestions.has(currentQ.id) ? "bg-red-50 text-red-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
              >
                <FlagIcon className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-base font-medium text-gray-900 leading-relaxed break-words">
              {currentQ.question_text}
            </h2>
          </div>

          {renderQuestionOptions(currentQ)}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${currentQuestion === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
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
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${currentQuestion === totalQuestions - 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <span className="text-sm font-medium">Selanjutnya</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 pb-3 pt-2 border-t border-gray-100">
            <button
              onClick={checkSubmitConditions}
              className={`w-full py-3 rounded-lg font-medium text-sm transition-colors ${isAllAnswered ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"}`}
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
                {questions.map((question, index) => {
                  const status = getQuestionStatus(index);
                  const isCurrent = index === currentQuestion;
                  const isAnswered = getQuestionStatus(index) === "answered";

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
                      className={`aspect-square rounded-lg border ${borderColor} ${bgColor} flex flex-col items-center justify-center transition-transform active:scale-95 ${textColor}`}
                    >
                      <span className="text-sm font-medium">{index + 1}</span>
                      {status === "flagged" && (
                        <div className="mt-1">
                          <FlagIcon className="w-3 h-3 text-red-500" />
                        </div>
                      )}
                      {question.question_type === "short_answer" && (
                        <div className="mt-1 text-xs">📝</div>
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
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded flex items-center justify-center text-xs">
                    📝
                  </div>
                  <span className="text-gray-600">Isian</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
