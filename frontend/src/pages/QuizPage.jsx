import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/EduFrameLoading.png";
import {
  ClockIcon,
  SearchIcon,
  UsersIcon,
  ChevronRightIcon,
  BookOpenIcon,
} from "../components/icons/IkonWrapper";
import quizApi from "../api/quiz";

const QuizPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userStats, setUserStats] = useState(null);
  const [userQuizResults, setUserQuizResults] = useState({});

  const fetchQuizzes = async () => {
    try {
      setLoading(true);

      const cacheKey = subjectId
        ? `quizzes_subject_${subjectId}`
        : "quizzes_all";
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const thirtyMinutes = 30 * 60 * 1000;

        if (Date.now() - timestamp < thirtyMinutes) {
          setQuizzes(data);
          setLoading(false);
          return;
        }
      }

      let result;
      if (subjectId) {
        result = await quizApi.getQuizzesBySubject(subjectId);
      } else {
        result = await quizApi.getAllQuizzes();
      }

      if (result.success) {
        const quizzesData = result.data || [];

        const quizzesWithDetails = await Promise.all(
          quizzesData.map(async (quiz) => {
            const detailCacheKey = `quiz_basic_${quiz.id}`;
            const cachedDetail = localStorage.getItem(detailCacheKey);

            if (cachedDetail) {
              const { data, timestamp } = JSON.parse(cachedDetail);
              const thirtyMinutes = 30 * 60 * 1000;

              if (Date.now() - timestamp < thirtyMinutes) {
                return {
                  ...quiz,
                  total_questions: data.total_questions || 0,
                  has_questions: data.has_questions || false,
                };
              }
            }

            try {
              const quizDetail = await quizApi.getQuizWithQuestions(quiz.id);
              let detailData = {
                total_questions: 0,
                has_questions: false,
              };

              if (quizDetail.success && quizDetail.data) {
                detailData = {
                  total_questions:
                    quizDetail.data.total_questions ||
                    quizDetail.data.questions?.length ||
                    0,
                  has_questions: (quizDetail.data.questions?.length || 0) > 0,
                };
              }

              localStorage.setItem(
                detailCacheKey,
                JSON.stringify({
                  data: detailData,
                  timestamp: Date.now(),
                }),
              );

              return {
                ...quiz,
                ...detailData,
              };
            } catch (error) {
              return {
                ...quiz,
                total_questions: 0,
                has_questions: false,
              };
            }
          }),
        );

        setQuizzes(quizzesWithDetails);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: quizzesWithDetails,
            timestamp: Date.now(),
          }),
        );
      } else {
        setQuizzes([]);
      }
    } catch (error) {
      const cacheKey = subjectId
        ? `quizzes_subject_${subjectId}`
        : "quizzes_all";
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data } = JSON.parse(cached);
        setQuizzes(data);
      } else {
        setQuizzes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const cacheKey = "user_stats_cache";
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const thirtyMinutes = 30 * 60 * 1000;

        if (Date.now() - timestamp < thirtyMinutes) {
          setUserStats(data);
          return;
        }
      }

      const result = await quizApi.getUserStats();
      if (result.success) {
        setUserStats(result.data);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: result.data,
            timestamp: Date.now(),
          }),
        );
      }
    } catch (error) {
      const cacheKey = "user_stats_cache";
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data } = JSON.parse(cached);
        setUserStats(data);
      }
    }
  };

  const fetchUserQuizResults = async () => {
    try {
      const cacheKey = "user_quiz_results_cache";
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const twoMinutes = 2 * 60 * 1000;

        if (Date.now() - timestamp < twoMinutes) {
          const resultsMap = {};
          data.forEach((quizResult) => {
            resultsMap[quizResult.quiz_id] = {
              score: quizResult.score,
              completed_at: quizResult.completed_at,
              hasAttempted: true,
            };
          });
          setUserQuizResults(resultsMap);
          return;
        }
      }

      const result = await quizApi.getUserResults();
      if (result.success && result.data) {
        const resultsMap = {};
        result.data.forEach((quizResult) => {
          resultsMap[quizResult.quiz_id] = {
            score: quizResult.score,
            completed_at: quizResult.completed_at,
            hasAttempted: true,
          };
        });
        setUserQuizResults(resultsMap);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: result.data,
            timestamp: Date.now(),
          }),
        );
      }
    } catch (error) {
      const cacheKey = "user_quiz_results_cache";
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data } = JSON.parse(cached);
        const resultsMap = {};
        data.forEach((quizResult) => {
          resultsMap[quizResult.quiz_id] = {
            score: quizResult.score,
            completed_at: quizResult.completed_at,
            hasAttempted: true,
          };
        });
        setUserQuizResults(resultsMap);
      }
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchUserStats();
    fetchUserQuizResults();
  }, [subjectId]);

  const handleStartQuiz = async (quizId) => {
    try {
      const cacheKey = `quiz_detail_${quizId}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const thirtyMinutes = 30 * 60 * 1000;

        if (
          Date.now() - timestamp < thirtyMinutes &&
          data.questions?.length > 0
        ) {
          navigate(`/quiz/${quizId}/play`, {
            state: {
              quiz: data,
              startTime: new Date().toISOString(),
            },
          });
          return;
        }
      }

      const result = await quizApi.getQuizWithQuestions(quizId);

      if (result.success && result.data && result.data.questions?.length > 0) {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: result.data,
            timestamp: Date.now(),
          }),
        );

        navigate(`/quiz/${quizId}/play`, {
          state: {
            quiz: result.data,
            startTime: new Date().toISOString(),
          },
        });
      } else {
        alert("Kuis tidak memiliki soal atau sedang dalam perbaikan");
      }
    } catch (error) {
      navigate(`/quiz/${quizId}/play`);
    }
  };

  const handleViewResults = (quizId) => {
    navigate(`/quiz/${quizId}/result`);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchQuizzes();
      return;
    }

    try {
      setLoading(true);
      const result = await quizApi.searchQuizzes(searchQuery);

      if (result.success) {
        setQuizzes(result.data);
      }
    } catch (error) {
      console.error("Error searching quizzes:", error);
    } finally {
      setLoading(false);
    }
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

  const getLastUpdated = (createdAt) => {
    if (!createdAt) return "Baru saja";

    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "1 hari lalu";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return `${Math.floor(diffDays / 30)} bulan lalu`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreIconColor = (score) => {
    if (score >= 60) return "bg-green-500";
    return "bg-red-500";
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quiz.description &&
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (quiz.category &&
        quiz.category.toLowerCase().includes(searchQuery.toLowerCase())),
  );

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
          Memuat Quiz...
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kuis berdasarkan judul atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {userStats && userStats.total_attempts > 0 && (
        <div className="px-4 pt-6 pb-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Statistik Anda
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">
                  {userStats.total_attempts}
                </div>
                <div className="text-xs text-gray-600">Kuis Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">
                  {userStats.average_score}%
                </div>
                <div className="text-xs text-gray-600">Rata-rata</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">
                  {userStats.total_score}
                </div>
                <div className="text-xs text-gray-600">Total Poin</div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              onClick={() => {
                setSearchQuery("");
                fetchQuizzes();
              }}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Lihat Semua Kuis
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuizzes.map((quiz) => {
              const userResult = userQuizResults[quiz.id];
              const hasAttempted = !!userResult;
              const score = userResult?.score || 0;
              const hasQuestions = quiz.has_questions;
              const totalQuestions = quiz.total_questions || 0;

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-red-300 transition-colors"
                >
                  <div className="px-4 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span className="text-xs font-medium text-gray-700">
                          {quiz.category || "Umum"}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                          quiz.difficulty || "Medium",
                        )}`}
                      >
                        {quiz.difficulty || "Medium"}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {quiz.description ||
                        "Tes pengetahuan Anda dengan kuis ini"}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span>{quiz.duration_minutes || 15} menit</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>
                          {hasQuestions ? `${totalQuestions} soal` : "0 soal"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4 text-gray-400" />
                        <span>{quiz.participants || 0} peserta</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {hasAttempted ? (
                          <>
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${getScoreIconColor(
                                  score,
                                )}`}
                              ></div>
                              <span
                                className={`text-sm font-medium ${getScoreColor(
                                  score,
                                )}`}
                              >
                                Skor: {score}%
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              •{" "}
                              {getLastUpdated(
                                userResult.completed_at || quiz.created_at,
                              )}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-600">
                            {hasQuestions ? "Belum dicoba" : "Tidak ada soal"} •{" "}
                            {getLastUpdated(quiz.created_at)}
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
                            disabled={!hasQuestions}
                            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                              hasQuestions
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {hasQuestions ? "Mulai Kuis" : "Tidak Tersedia"}
                            {hasQuestions && (
                              <ChevronRightIcon className="w-4 h-4" />
                            )}
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

      <div className="px-4 pt-4 pb-6 border-t border-gray-200 bg-red-100">
        <div className="max-w-md mx-auto mb-30">
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
