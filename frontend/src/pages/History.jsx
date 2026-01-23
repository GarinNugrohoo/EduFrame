import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { quiz } from "../api/quiz";
import {
  ArrowLeftIcon,
  TrophyIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  ArrowRightIcon,
  RefreshIcon,
  SearchIcon,
  XIcon,
  CheckIcon,
} from "../components/icons/IkonWrapper";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [quizTitles, setQuizTitles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      setError("");

      const resultsResponse = await quiz.getUserResults();

      if (resultsResponse.success && Array.isArray(resultsResponse.data)) {
        const resultsData = resultsResponse.data;

        const sortedResults = resultsData.sort((a, b) => {
          const dateA = new Date(a.completed_at || a.saved_at || 0);
          const dateB = new Date(b.completed_at || b.saved_at || 0);
          return dateB - dateA;
        });

        setResults(sortedResults);

        await loadQuizTitles(sortedResults);
      } else {
        setError(resultsResponse.message || "Gagal memuat riwayat");
        setResults([]);
      }
    } catch (error) {
      console.error("Error loading history:", error);
      setError("Terjadi kesalahan saat memuat data");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadQuizTitles = async (resultsData) => {
    const titles = {};
    const uniqueQuizIds = [...new Set(resultsData.map((r) => r.quiz_id))];

    for (const quizId of uniqueQuizIds) {
      try {
        const quizResponse = await quiz.getQuizById(quizId);
        if (quizResponse.success && quizResponse.data) {
          titles[quizId] = quizResponse.data.title || `Kuis #${quizId}`;
        }
      } catch (error) {
        console.error(`Error loading quiz ${quizId}:`, error);
        titles[quizId] = `Kuis #${quizId}`;
      }
    }

    setQuizTitles(titles);
  };

  const filteredResults = useMemo(() => {
    let filtered = [...results];

    if (activeFilter !== "all") {
      filtered = filtered.filter((result) => {
        const total = result.total_questions || 0;
        const correct = result.correct_answers || 0;
        const allCorrect = correct === total;

        return activeFilter === "correct" ? allCorrect : !allCorrect;
      });
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((result) => {
        const title = quizTitles[result.quiz_id] || `Kuis #${result.quiz_id}`;
        return title.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return filtered;
  }, [results, searchTerm, activeFilter, quizTitles]);

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
      });
    } catch (error) {
      return "-";
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0s";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const handleViewDetail = (result) => {
    navigate(`/history/${result.id}`, { state: { result } });
  };

  const getQuizTitle = (quizId) => {
    return quizTitles[quizId] || `Kuis #${quizId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 safe-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">Memuat riwayat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>

          <h1 className="text-base font-semibold text-gray-900">
            Riwayat Kuis
          </h1>

          <button
            onClick={loadHistoryData}
            className="p-2 text-gray-600 hover:text-red-600 active:scale-95 touch-manipulation"
            aria-label="Refresh"
          >
            <RefreshIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari judul kuis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:border-red-500 focus:ring-1 focus:ring-red-200 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all touch-manipulation ${
                activeFilter === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveFilter("correct")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all touch-manipulation flex items-center justify-center gap-1 ${
                activeFilter === "correct"
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <CheckIcon className="w-4 h-4" />
              Benar Semua
            </button>
            <button
              onClick={() => setActiveFilter("incorrect")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all touch-manipulation flex items-center justify-center gap-1 ${
                activeFilter === "incorrect"
                  ? "bg-red-100 text-red-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <XIcon className="w-4 h-4" />
              Ada Salah
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 text-red-600 mx-auto mb-4">
              <XIcon className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Gagal Memuat Data
            </h3>
            <p className="text-red-700 mb-4 text-sm">{error}</p>
            <button
              onClick={loadHistoryData}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-5 rounded-xl active:scale-95 touch-manipulation"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || activeFilter !== "all"
                ? "Tidak ditemukan"
                : "Belum ada riwayat"}
            </h3>
            <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
              {searchTerm
                ? "Coba dengan kata kunci lain"
                : activeFilter !== "all"
                  ? "Tidak ada hasil dengan filter ini"
                  : "Mulai kerjakan kuis untuk melihat riwayat di sini"}
            </p>
            {searchTerm || activeFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("all");
                }}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Reset pencarian
              </button>
            ) : (
              <button
                onClick={() => navigate("/quiz")}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-5 rounded-xl inline-flex items-center gap-2 active:scale-95 touch-manipulation"
              >
                <ArrowRightIcon className="w-4 h-4" />
                Mulai Kuis
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                Menampilkan{" "}
                <span className="font-semibold">{filteredResults.length}</span>{" "}
                kuis
              </p>
            </div>

            <div className="space-y-3">
              {filteredResults.map((result) => {
                const total = result.total_questions || 0;
                const correct = result.correct_answers || 0;
                const allCorrect = correct === total;
                const quizTitle = getQuizTitle(result.quiz_id);

                return (
                  <div
                    key={result.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-red-300 active:scale-[0.995] transition-all touch-manipulation overflow-hidden"
                  >
                    <button
                      onClick={() => handleViewDetail(result)}
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            allCorrect ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {allCorrect ? (
                            <CheckIcon className="w-5 h-5 text-green-600" />
                          ) : (
                            <XIcon className="w-5 h-5 text-red-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                              {quizTitle}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                allCorrect
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {allCorrect
                                ? "Benar Semua"
                                : `${correct}/${total}`}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>
                                {formatDate(
                                  result.completed_at || result.saved_at,
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>{formatTime(result.time_taken || 0)}</span>
                            </div>
                            {result.server_saved === false && (
                              <span className="inline-flex items-center gap-1 text-amber-600">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                Lokal
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-gray-400 self-center">
                          <ArrowRightIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 mb-25 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-xs">
                Menampilkan {filteredResults.length} dari {results.length} kuis
              </p>
            </div>
          </>
        )}

        {filteredResults.length > 3 && (
          <div className="fixed bottom-6 right-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 touch-manipulation transition-all"
              aria-label="Scroll ke atas"
            >
              <ArrowLeftIcon className="w-5 h-5 rotate-90" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
