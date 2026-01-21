import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  TrendingUpIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  XIcon,
  TrophyIcon,
  DownloadIcon,
  RefreshIcon,
} from "../components/icons/IkonWrapper";

const QuizHistoryPage = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, passed, failed, last_week, last_month
  const [sortBy, setSortBy] = useState("date"); // date, score, duration
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [expandedQuiz, setExpandedQuiz] = useState(null);

  // Data dummy riwayat
  const dummyHistory = [
    {
      id: 1,
      quiz_id: 1,
      quiz_title: "Persamaan Kuadrat",
      category: "Aljabar",
      completed_at: "2024-01-15T14:30:00",
      score: 85,
      total_questions: 10,
      correct_answers: 8,
      time_spent_seconds: 720,
      is_passed: true,
      points_earned: 85,
      difficulty: "Medium",
    },
    {
      id: 2,
      quiz_id: 2,
      quiz_title: "Fungsi Linier",
      category: "Aljabar",
      completed_at: "2024-01-14T10:15:00",
      score: 92,
      total_questions: 8,
      correct_answers: 7,
      time_spent_seconds: 540,
      is_passed: true,
      points_earned: 92,
      difficulty: "Mudah",
    },
    {
      id: 3,
      quiz_id: 3,
      quiz_title: "Statistika Dasar",
      category: "Statistika",
      completed_at: "2024-01-12T16:45:00",
      score: 58,
      total_questions: 12,
      correct_answers: 7,
      time_spent_seconds: 960,
      is_passed: false,
      points_earned: 58,
      difficulty: "Sulit",
    },
    {
      id: 4,
      quiz_id: 4,
      quiz_title: "Geometri Analitik",
      category: "Geometri",
      completed_at: "2024-01-10T09:20:00",
      score: 75,
      total_questions: 10,
      correct_answers: 7,
      time_spent_seconds: 680,
      is_passed: true,
      points_earned: 75,
      difficulty: "Medium",
    },
    {
      id: 5,
      quiz_id: 5,
      quiz_title: "Trigonometri Dasar",
      category: "Trigonometri",
      completed_at: "2024-01-08T13:10:00",
      score: 90,
      total_questions: 15,
      correct_answers: 13,
      time_spent_seconds: 1200,
      is_passed: true,
      points_earned: 90,
      difficulty: "Sulit",
    },
    {
      id: 6,
      quiz_id: 1,
      quiz_title: "Persamaan Kuadrat",
      category: "Aljabar",
      completed_at: "2024-01-05T11:30:00",
      score: 78,
      total_questions: 10,
      correct_answers: 8,
      time_spent_seconds: 650,
      is_passed: true,
      points_earned: 78,
      difficulty: "Medium",
    },
    {
      id: 7,
      quiz_id: 3,
      quiz_title: "Statistika Dasar",
      category: "Statistika",
      completed_at: "2024-01-03T15:45:00",
      score: 65,
      total_questions: 12,
      correct_answers: 8,
      time_spent_seconds: 890,
      is_passed: true,
      points_earned: 65,
      difficulty: "Sulit",
    },
  ];

  // Statistik ringkasan
  const [stats, setStats] = useState({
    totalAttempts: 0,
    totalPassed: 0,
    totalFailed: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setHistory(dummyHistory);
      calculateStats(dummyHistory);
      setLoading(false);
    }, 800);
  }, []);

  const calculateStats = (data) => {
    const totalAttempts = data.length;
    const totalPassed = data.filter((item) => item.is_passed).length;
    const totalFailed = totalAttempts - totalPassed;
    const averageScore =
      totalAttempts > 0
        ? Math.round(
            data.reduce((sum, item) => sum + item.score, 0) / totalAttempts,
          )
        : 0;
    const totalTimeSpent = data.reduce(
      (sum, item) => sum + item.time_spent_seconds,
      0,
    );
    const totalPoints = data.reduce((sum, item) => sum + item.points_earned, 0);

    setStats({
      totalAttempts,
      totalPassed,
      totalFailed,
      averageScore,
      totalTimeSpent,
      totalPoints,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleRetakeQuiz = (quizId) => {
    navigate(`/quiz/${quizId}/play`);
  };

  const handleViewDetails = (quizId) => {
    navigate(`/quiz/${quizId}/result`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hari ini";
    } else if (diffDays === 1) {
      return "Kemarin";
    } else if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}j ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}d`;
    } else {
      return `${secs}d`;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-700";
    if (score >= 60) return "text-amber-700";
    return "text-red-700";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-50 border-green-100";
    if (score >= 60) return "bg-amber-50 border-amber-100";
    return "bg-red-50 border-red-100";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Mudah":
        return "text-green-700 bg-green-50";
      case "Medium":
        return "text-amber-700 bg-amber-50";
      case "Sulit":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  // Filter dan sort data
  const filteredAndSortedHistory = () => {
    let filtered = [...history];

    // Apply filter
    switch (filter) {
      case "passed":
        filtered = filtered.filter((item) => item.is_passed);
        break;
      case "failed":
        filtered = filtered.filter((item) => !item.is_passed);
        break;
      case "last_week":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(
          (item) => new Date(item.completed_at) > oneWeekAgo,
        );
        break;
      case "last_month":
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filtered = filtered.filter(
          (item) => new Date(item.completed_at) > oneMonthAgo,
        );
        break;
      default:
        break;
    }

    // Apply sort
    filtered.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case "score":
          compareA = a.score;
          compareB = b.score;
          break;
        case "duration":
          compareA = a.time_spent_seconds;
          compareB = b.time_spent_seconds;
          break;
        case "date":
        default:
          compareA = new Date(a.completed_at);
          compareB = new Date(b.completed_at);
          break;
      }

      if (sortOrder === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleExportHistory = () => {
    // Simulasi export data
    const dataStr = JSON.stringify(filteredAndSortedHistory(), null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `quiz-history-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const toggleExpandQuiz = (quizId) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Memuat riwayat...</p>
        </div>
      </div>
    );
  }

  const displayHistory = filteredAndSortedHistory();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                Riwayat Kuis
              </h1>
              <p className="text-sm text-gray-600">
                Pelacakan performa dan perkembangan
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-4 pt-6 pb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              Ringkasan Statistik
            </h3>
            <TrendingUpIcon className="w-5 h-5 text-red-600" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">
                  Total Percobaan
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {stats.totalAttempts}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Rata-rata Skor</div>
                <div className="text-xl font-semibold text-gray-900">
                  {stats.averageScore}%
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">Berhasil</div>
                  <div className="text-lg font-semibold text-green-700">
                    {stats.totalPassed}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">Gagal</div>
                  <div className="text-lg font-semibold text-red-700">
                    {stats.totalFailed}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Total Poin</div>
                <div className="text-xl font-semibold text-gray-900">
                  {stats.totalPoints}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600">
                  Total Waktu Belajar
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatTime(stats.totalTimeSpent)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Controls */}
      <div className="px-4 py-3 bg-white border-y border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 appearance-none"
              >
                <option value="all">Semua Percobaan</option>
                <option value="passed">Berhasil</option>
                <option value="failed">Gagal</option>
                <option value="last_week">Minggu Lalu</option>
                <option value="last_month">Bulan Lalu</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-4 pr-8 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 appearance-none"
              >
                <option value="date">Urutkan berdasarkan</option>
                <option value="date">Tanggal</option>
                <option value="score">Skor</option>
                <option value="duration">Durasi</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
              >
                {sortOrder === "asc" ? (
                  <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">
            Riwayat Percobaan ({displayHistory.length})
          </h3>
          <button
            onClick={handleExportHistory}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Ekspor</span>
          </button>
        </div>

        {displayHistory.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-base font-medium text-gray-900 mb-2">
              Tidak ada riwayat
            </h4>
            <p className="text-sm text-gray-600 mb-6">
              {filter === "all"
                ? "Belum ada riwayat kuis"
                : "Tidak ada riwayat yang sesuai dengan filter"}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Lihat Semua Riwayat
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-red-300 transition-colors"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(
                            item.difficulty,
                          )}`}
                        >
                          {item.difficulty}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-1">
                        {item.quiz_title}
                      </h4>
                    </div>
                    <div
                      className={`ml-3 px-3 py-1.5 rounded-lg border ${getScoreBgColor(
                        item.score,
                      )}`}
                    >
                      <div
                        className={`text-sm font-semibold ${getScoreColor(item.score)}`}
                      >
                        {item.score}%
                      </div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(item.completed_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span>{formatTime(item.time_spent_seconds)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.is_passed ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <XIcon className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={
                          item.is_passed ? "text-green-700" : "text-red-700"
                        }
                      >
                        {item.is_passed ? "Berhasil" : "Gagal"}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {expandedQuiz === item.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600 mb-1">
                            Soal Benar
                          </div>
                          <div className="text-base font-semibold text-gray-900">
                            {item.correct_answers}/{item.total_questions}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600 mb-1">
                            Poin Diperoleh
                          </div>
                          <div className="text-base font-semibold text-gray-900">
                            {item.points_earned}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Selesai:{" "}
                        {new Date(item.completed_at).toLocaleString("id-ID")}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpandQuiz(item.id)}
                        className="text-xs text-gray-600 hover:text-gray-900"
                      >
                        {expandedQuiz === item.id ? "Sembunyikan" : "Detail"}
                      </button>
                      <span className="text-xs text-gray-400">•</span>
                      <button
                        onClick={() => handleViewDetails(item.quiz_id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Lihat Hasil Lengkap
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewQuiz(item.quiz_id)}
                        className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Lihat Kuis
                      </button>
                      <button
                        onClick={() => handleRetakeQuiz(item.quiz_id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Ulangi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      {displayHistory.length > 0 && (
        <div className="px-4 py-6 bg-white border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-4">
            Analisis Performa
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Skor Tertinggi</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.max(...displayHistory.map((h) => h.score))}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Skor Terendah</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.min(...displayHistory.map((h) => h.score))}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Kuis Paling Sering Diulang
              </span>
              <span className="text-sm font-medium text-gray-900">
                {(() => {
                  const quizCounts = {};
                  displayHistory.forEach((h) => {
                    quizCounts[h.quiz_title] =
                      (quizCounts[h.quiz_title] || 0) + 1;
                  });
                  const mostFrequent = Object.entries(quizCounts).sort(
                    (a, b) => b[1] - a[1],
                  )[0];
                  return mostFrequent
                    ? `${mostFrequent[0]} (${mostFrequent[1]}x)`
                    : "-";
                })()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-900">
              {stats.totalPoints} Poin
            </span>
          </div>

          <button
            onClick={() => navigate("/quiz")}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Kuis
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizHistoryPage;
