import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { quiz } from "../api/quiz";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XIcon,
  FileTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  ClockIcon,
  CheckIcon,
} from "../components/icons/IkonWrapper";
import logo from "../assets/EduFrameLoading.png";

const HistoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState([]);
  const [quizDetails, setQuizDetails] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const contentRef = useRef(null);

  useEffect(() => {
    if (!result) {
      loadResultDetail();
    } else {
      parseAnswersData();
      loadQuizDetails();
    }
  }, [result]);

  useEffect(() => {
    if (contentRef.current && !loading && !error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [loading, error]);

  const loadResultDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const resultsResponse = await quiz.getUserResults();

      if (resultsResponse.success && Array.isArray(resultsResponse.data)) {
        const foundResult = resultsResponse.data.find(
          (r) =>
            r.id === parseInt(id) ||
            r.quiz_id === parseInt(id) ||
            (r.completed_at && r.completed_at.includes(id)),
        );

        if (foundResult) {
          setResult(foundResult);
          parseAnswersData(foundResult);
          loadQuizDetails(foundResult.quiz_id);
        } else {
          setError("Riwayat tidak ditemukan");
        }
      } else {
        setError("Gagal memuat detail riwayat");
      }
    } catch (error) {
      console.error("Error loading result detail:", error);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const parseAnswersData = (resultData = result) => {
    if (!resultData?.answers_data) return;

    try {
      const parsedAnswers =
        typeof resultData.answers_data === "string"
          ? JSON.parse(resultData.answers_data)
          : resultData.answers_data;

      if (Array.isArray(parsedAnswers)) {
        setAnswers(parsedAnswers);
        const firstIncorrect = parsedAnswers.findIndex((a) => !a.is_correct);
        if (firstIncorrect !== -1) {
          setExpandedQuestions({ [firstIncorrect]: true });
        } else if (parsedAnswers.length > 0) {
          setExpandedQuestions({ 0: true });
        }
      }
    } catch (error) {
      console.error("Error parsing answers:", error);
      setAnswers([]);
    }
  };

  const loadQuizDetails = async (quizId) => {
    if (!quizId && result?.quiz_id) {
      quizId = result.quiz_id;
    }

    if (!quizId) return;

    try {
      const quizResponse = await quiz.getQuizById(quizId);
      if (quizResponse.success) {
        setQuizDetails(quizResponse.data);
      }
    } catch (error) {
      console.error("Error loading quiz details:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

      if (diffHours < 24) {
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          return diffMinutes < 1 ? "Baru saja" : `${diffMinutes}m lalu`;
        }
        return `${diffHours} jam lalu`;
      }

      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) return "Kemarin";
      if (diffDays < 7) return `${diffDays} hari lalu`;

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0 detik";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredAnswers = () => {
    switch (activeFilter) {
      case "correct":
        return answers.filter((a) => a.is_correct);
      case "incorrect":
        return answers.filter((a) => !a.is_correct);
      default:
        return answers;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 mt-45" role="status" aria-live="polite">
        <div className="inline-block from-red-50 to-white rounded-2xl mb-2">
          <div className="relative">
            <img
              src={logo}
              alt="EduFrame Loading"
              className="w-20 h-22 text-red-400 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
        <p className="text-red-500 font-medium italic flex-row">
          Memuat Detail Riwayat...
        </p>
        <div className="mt-4 flex justify-center space-x-2">
          {[0, 100, 300].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 py-2 touch-manipulation active:opacity-70"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Kembali</span>
          </button>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
            <XIcon className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {error || "Riwayat tidak ditemukan"}
            </h3>
            <p className="text-red-700 mb-4 text-sm">
              Data riwayat yang Anda cari tidak dapat ditemukan.
            </p>
            <button
              onClick={() => navigate("/history")}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors active:scale-95 touch-manipulation w-full"
            >
              Kembali ke Riwayat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      className="min-h-screen bg-gray-50 safe-top safe-bottom"
    >
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 active:text-gray-900 active:scale-95 touch-manipulation"
            aria-label="Kembali"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium hidden xs:inline">
              Kembali
            </span>
          </button>

          <h1 className="text-base font-semibold text-gray-900 truncate max-w-[50vw]">
            {quizDetails?.title || `Kuis #${result.quiz_id}`}
          </h1>

          <div className="w-10"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex flex-col items-center mb-6">
              <div className="flex gap-8 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {result.correct_answers || 0}
                  </div>
                  <div className="text-xs text-gray-600">Benar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {(result.total_questions || 0) -
                      (result.correct_answers || 0)}
                  </div>
                  <div className="text-xs text-gray-600">Salah</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">
                    {result.total_questions || 0}
                  </div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${result.correct_answers === result.total_questions ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {result.correct_answers === result.total_questions ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Semua Benar</span>
                  </>
                ) : (
                  <>
                    <XIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Ada Jawaban Salah
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  Waktu
                </span>
                <span className="font-semibold">
                  {formatTime(result.time_taken || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Tanggal
                </span>
                <span className="font-semibold text-right">
                  {formatDate(result.completed_at || result.saved_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all touch-manipulation ${
                activeFilter === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Semua ({answers.length})
            </button>
            <button
              onClick={() => setActiveFilter("correct")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all touch-manipulation ${
                activeFilter === "correct"
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Benar ({answers.filter((a) => a.is_correct).length})
            </button>
            <button
              onClick={() => setActiveFilter("incorrect")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all touch-manipulation ${
                activeFilter === "incorrect"
                  ? "bg-red-100 text-red-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Salah ({answers.filter((a) => !a.is_correct).length})
            </button>
          </div>
        </div>

        <div className="mb-20">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-red-600" />
                Review Jawaban
                <span className="text-sm font-normal text-gray-500 ml-auto">
                  {filteredAnswers().length} dari {answers.length} soal
                </span>
              </h3>
            </div>

            <div className="p-4">
              {filteredAnswers().length > 0 ? (
                <div className="space-y-3">
                  {filteredAnswers().map((answer, index) => {
                    const originalIndex = answers.indexOf(answer);
                    const isExpanded = expandedQuestions[originalIndex];

                    return (
                      <div
                        key={originalIndex}
                        className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                          answer.is_correct
                            ? "border-green-200"
                            : "border-red-200"
                        }`}
                      >
                        <button
                          onClick={() => toggleQuestion(originalIndex)}
                          className="w-full p-4 text-left flex items-center justify-between touch-manipulation active:bg-gray-50"
                          aria-expanded={isExpanded}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                answer.is_correct
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {answer.is_correct ? (
                                <CheckCircleIcon className="w-4 h-4" />
                              ) : (
                                <XIcon className="w-4 h-4" />
                              )}
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-gray-900">
                                Soal #{originalIndex + 1}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    answer.is_correct
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {answer.is_correct ? "Benar" : "Salah"}
                                </span>
                                {!isExpanded && answer.question_text && (
                                  <span className="truncate max-w-[150px]">
                                    {answer.question_text.substring(0, 50)}...
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-400">
                            {isExpanded ? (
                              <ChevronUpIcon className="w-5 h-5" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                            <div className="space-y-3 pt-3">
                              <div>
                                <div className="text-xs text-gray-600 mb-1 font-medium">
                                  PERTANYAAN:
                                </div>
                                <p className="text-gray-900 text-sm leading-relaxed">
                                  {answer.question_text ||
                                    `Soal ${originalIndex + 1}`}
                                </p>
                              </div>

                              <div>
                                <div className="text-xs text-gray-600 mb-1 font-medium">
                                  JAWABAN ANDA:
                                </div>
                                <p
                                  className={`text-sm font-medium ${
                                    answer.is_correct
                                      ? "text-green-700"
                                      : "text-red-700"
                                  }`}
                                >
                                  {answer.selected_answer || "-"}
                                </p>
                              </div>

                              {!answer.is_correct && answer.correct_answer && (
                                <div>
                                  <div className="text-xs text-gray-600 mb-1 font-medium">
                                    JAWABAN BENAR:
                                  </div>
                                  <p className="text-green-700 font-medium text-sm">
                                    {answer.correct_answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {activeFilter === "all"
                      ? "Data jawaban tidak tersedia"
                      : `Tidak ada jawaban ${activeFilter === "correct" ? "benar" : "salah"}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        {filteredAnswers().length > 3 && (
          <div className="fixed bottom-6 right-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 touch-manipulation transition-all"
              aria-label="Scroll ke atas"
            >
              <ChevronUpIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryDetailPage;
