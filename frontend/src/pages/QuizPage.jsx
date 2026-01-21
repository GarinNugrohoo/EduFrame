import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ClockIcon,
  TrophyIcon,
  SearchIcon,
  UsersIcon,
  ChevronRightIcon,
  BookOpenIcon,
} from "../components/icons/IkonWrapper";

const QuizPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState({});

  // Data dummy profesional
  const dummyQuizzes = [
    {
      id: 1,
      title: "Persamaan Kuadrat",
      description: "10 soal konsep dasar persamaan kuadrat dan aplikasinya",
      subject_id: subjectId || "1",
      category: "Aljabar",
      difficulty: "Medium",
      total_questions: 10,
      duration_minutes: 15,
      points: 100,
      participants: 342,
      last_updated: "2 hari lalu",
    },
    {
      id: 2,
      title: "Fungsi Linier",
      description: "Tes pemahaman fungsi linier dan interpretasi grafik",
      subject_id: subjectId || "1",
      category: "Aljabar",
      difficulty: "Mudah",
      total_questions: 8,
      duration_minutes: 12,
      points: 80,
      participants: 215,
      last_updated: "1 minggu lalu",
    },
    {
      id: 3,
      title: "Statistika Dasar",
      description: "Konsep mean, median, modus, dan penyajian data",
      subject_id: subjectId || "1",
      category: "Statistika",
      difficulty: "Sulit",
      total_questions: 12,
      duration_minutes: 20,
      points: 150,
      participants: 189,
      last_updated: "3 hari lalu",
    },
    {
      id: 4,
      title: "Geometri Analitik",
      description: "Soal tentang titik, garis, dan bidang dalam koordinat",
      subject_id: subjectId || "1",
      category: "Geometri",
      difficulty: "Medium",
      total_questions: 10,
      duration_minutes: 18,
      points: 120,
      participants: 156,
      last_updated: "1 bulan lalu",
    },
    {
      id: 5,
      title: "Trigonometri Dasar",
      description: "Konsep sin, cos, tan dan aplikasi segitiga siku-siku",
      subject_id: subjectId || "1",
      category: "Trigonometri",
      difficulty: "Sulit",
      total_questions: 15,
      duration_minutes: 25,
      points: 200,
      participants: 278,
      last_updated: "1 minggu lalu",
    },
  ];

  // Data hasil user
  const getUserResults = () => {
    const saved = localStorage.getItem(`quiz_results_${subjectId}`);
    return saved ? JSON.parse(saved) : {};
  };

  // Statistik sederhana
  const getUserStats = () => {
    const results = getUserResults();
    const completedQuizzes = Object.keys(results).length;

    if (completedQuizzes === 0) {
      return {
        totalCompleted: 0,
        averageScore: 0,
        totalPoints: 0,
      };
    }

    const scores = Object.values(results).map((result) =>
      Math.round((result.correct_answers / result.total_questions) * 100),
    );
    const averageScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length,
    );

    const totalPoints = Object.values(results).reduce(
      (sum, result) => sum + result.score,
      0,
    );

    return {
      totalCompleted: completedQuizzes,
      averageScore,
      totalPoints,
    };
  };

  useEffect(() => {
    setTimeout(() => {
      setQuizzes(dummyQuizzes);
      setUserResults(getUserResults());
      setLoading(false);
    }, 600);
  }, [subjectId]);

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}/play`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewResults = (quizId) => {
    navigate(`/quiz/${quizId}/result`);
  };

  const getQuizResult = (quizId) => {
    return userResults[quizId] || null;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
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

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const userStats = getUserStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Clean */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kuis berdasarkan judul atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview - Minimal */}
      {userStats.totalCompleted > 0 && (
        <div className="px-4 pt-6 pb-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Statistik Anda
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">
                  {userStats.totalCompleted}
                </div>
                <div className="text-xs text-gray-600">Kuis Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">
                  {userStats.averageScore}%
                </div>
                <div className="text-xs text-gray-600">Rata-rata</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">
                  {userStats.totalPoints}
                </div>
                <div className="text-xs text-gray-600">Total Poin</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes List */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Kuis Tersedia
          </h2>
          <span className="text-sm text-gray-500">
            {filteredQuizzes.length} dari {quizzes.length}
          </span>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Kuis tidak ditemukan
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Coba kata kunci lain atau lihat semua kuis
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Lihat Semua Kuis
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuizzes.map((quiz) => {
              const result = getQuizResult(quiz.id);
              const hasAttempted = result !== null;
              const score = result
                ? Math.round(
                    (result.correct_answers / result.total_questions) * 100,
                  )
                : 0;

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-red-300 transition-colors"
                >
                  {/* Category indicator */}
                  <div className="px-4 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-700">
                          {quiz.category}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                          quiz.difficulty,
                        )}`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Quiz Content */}
                  <div className="px-4 pb-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {quiz.description}
                    </p>

                    {/* Quiz Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span>{quiz.duration_minutes} menit</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>{quiz.total_questions} soal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4 text-gray-400" />
                        <span>{quiz.participants}</span>
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {hasAttempted ? (
                          <>
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  score >= 60 ? "bg-green-500" : "bg-red-500"
                                }`}
                              ></div>
                              <span
                                className={`text-sm font-medium ${getScoreColor(score)}`}
                              >
                                Skor: {score}%
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              • {quiz.last_updated}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-600">
                            Belum dicoba • {quiz.last_updated}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {hasAttempted ? (
                          <>
                            <button
                              onClick={() => handleViewResults(quiz.id)}
                              className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              Hasil
                            </button>
                            <button
                              onClick={() => handleStartQuiz(quiz.id)}
                              className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Coba Lagi
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStartQuiz(quiz.id)}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                          >
                            Mulai Kuis
                            <ChevronRightIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="px-4 pt-4 pb-6 border-t border-gray-200 bg-red-100 mb-25">
        <div className="max-w-md mx-auto">
          <h4 className="text-sm font-medium text-gray-900 mb-3 text-center">
            Tips Pengerjaan
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-50 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-red-700">1</span>
              </div>
              <p className="text-xs text-gray-600">
                Baca instruksi dan soal dengan cermat sebelum menjawab
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-50 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-red-700">2</span>
              </div>
              <p className="text-xs text-gray-600">
                Manfaatkan waktu dengan bijak, jangan terburu-buru
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-50 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-red-700">3</span>
              </div>
              <p className="text-xs text-gray-600">
                Periksa kembali jawaban sebelum mengirim
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
