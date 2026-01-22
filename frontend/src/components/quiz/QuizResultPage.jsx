import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  TrophyIcon,
  CheckCircleIcon,
  XIcon,
  ClockIcon,
  HomeIcon,
  ChevronLeftIcon,
  ArrowRightIcon,
  ChartBarIcon,
  StarIcon,
  TrendingUpIcon,
  BookOpenIcon,
} from "../icons/IkonWrapper";
import quizApi from "../../api/quiz";

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams();

  const [result, setResult] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil data dari state navigation atau fetch dari API
  useEffect(() => {
    const fetchResultData = async () => {
      try {
        setLoading(true);

        // Coba ambil dari state navigation
        const locationResult = location.state?.result;
        if (locationResult) {
          setResult(locationResult);
        } else {
          // Jika tidak ada di state, fetch dari API
          const resultResponse = await quizApi.getUserQuizResult(quizId);
          if (resultResponse.success) {
            setResult(resultResponse.data);
          }
        }

        // Fetch data quiz untuk mendapatkan title
        const quizResponse = await quizApi.getQuizById(quizId);
        if (quizResponse.success) {
          setQuizData(quizResponse.data);
        }
      } catch (error) {
        console.error("Error fetching result data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [quizId, location.state]);

  // Fallback data jika result null
  const safeResult = result || {
    quiz_id: parseInt(quizId),
    score: 0,
    total_questions: 0,
    correct_answers: 0,
    time_taken: 0,
    total_points: 0,
    earned_points: 0,
    completed_at: new Date().toISOString(),
  };

  const percentage = Math.round(safeResult.score);
  const isPassed = percentage >= 60;
  const wrongAnswers = safeResult.total_questions - safeResult.correct_answers;
  const timePerQuestion =
    safeResult.total_questions > 0
      ? (safeResult.time_taken / safeResult.total_questions).toFixed(1)
      : 0;

  const formatTime = (seconds) => {
    if (!seconds) return "0 detik";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} detik`;
    if (secs === 0) return `${mins} menit`;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Luar Biasa! 🏆";
    if (score >= 80) return "Bagus Sekali! 👍";
    if (score >= 70) return "Baik! 😊";
    if (score >= 60) return "Cukup Baik! 🙂";
    return "Perlu Belajar Lagi 💪";
  };

  const getScoreDescription = (score) => {
    if (score >= 90) return "Penguasaan materi Anda sangat baik!";
    if (score >= 80) return "Anda menguasai sebagian besar materi.";
    if (score >= 70) return "Pemahaman Anda cukup baik.";
    if (score >= 60) return "Anda lulus, namun perlu memperdalam lagi.";
    return "Jangan menyerah! Pelajari kembali materi yang sulit.";
  };

  const getSpeedRating = (timePerQuestion) => {
    if (timePerQuestion <= 30)
      return { label: "Cepat", color: "text-green-600", bg: "bg-green-100" };
    if (timePerQuestion <= 60)
      return { label: "Sedang", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "Perlu Cepat", color: "text-red-600", bg: "bg-red-100" };
  };

  const speedRating = getSpeedRating(timePerQuestion);

  const formatDate = (dateString) => {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Memuat hasil kuis...</p>
        </div>
      </div>
    );
  }

  if (!result && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/quiz")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
              aria-label="Kembali ke halaman kuis"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex-1 text-center px-2">
              <h1 className="text-base font-bold text-gray-900 truncate">
                Hasil Kuis
              </h1>
              <p className="text-xs text-gray-600 truncate">
                {quizData?.title || "Kuis"}
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
              aria-label="Beranda"
            >
              <HomeIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <BookOpenIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Belum Ada Hasil
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Anda belum mengerjakan kuis ini. Cobalah kerjakan terlebih dahulu!
          </p>
          <button
            onClick={() => navigate(`/quiz/${quizId}/play`)}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            Mulai Kuis
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/quiz")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
            aria-label="Kembali ke halaman kuis"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex-1 text-center px-2">
            <h1 className="text-base font-bold text-gray-900 truncate">
              Hasil Kuis
            </h1>
            <p className="text-xs text-gray-600 truncate">
              {quizData?.title || "Kuis"}
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
            aria-label="Beranda"
          >
            <HomeIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 px-4 pt-4">
        {/* Score Summary Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-5">
            {/* Completion Time */}
            <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Selesai pada:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(safeResult.completed_at)}
              </span>
            </div>

            <div className="flex flex-col items-center text-center mb-6">
              {/* Animated Score Circle */}
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={isPassed ? "#10b981" : "#ef4444"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${percentage * 2.827} 282.7`}
                    transform="rotate(-90 50 50)"
                    className="animate-progress"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className={`text-4xl font-bold ${getScoreColor(percentage)}`}
                  >
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Skor Akhir</div>
                </div>
              </div>

              <div className="mb-4">
                <div
                  className={`text-xl font-bold mb-2 ${getScoreColor(percentage)}`}
                >
                  {getScoreMessage(percentage)}
                </div>
                <p className="text-sm text-gray-600 max-w-sm">
                  {getScoreDescription(percentage)}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Benar
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {safeResult.correct_answers}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    dari {safeResult.total_questions} soal
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XIcon className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700">
                    Salah
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {wrongAnswers}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    dari {safeResult.total_questions} soal
                  </div>
                </div>
              </div>
            </div>

            {/* Time Stats */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Waktu Total
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatTime(safeResult.time_taken)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUpIcon className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      Rata-rata
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {timePerQuestion}s
                  </div>
                  <div
                    className={`text-xs ${speedRating.color} mt-1 font-medium`}
                  >
                    {speedRating.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Points Summary */}
            {safeResult.total_points > 0 && (
              <div className="mt-4 bg-yellow-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrophyIcon className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">
                    Poin yang Didapat
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {safeResult.earned_points || 0}
                    <span className="text-lg text-gray-500">
                      /{safeResult.total_points}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total poin dari kuis ini
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Detailed Performance Analysis */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <ChartBarIcon className="w-6 h-6 text-gray-700" />
            <h2 className="font-bold text-gray-900 text-lg">Analisis Detail</h2>
          </div>

          <div className="space-y-6">
            {/* Accuracy */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-base font-medium text-gray-900">
                    Akurasi Jawaban
                  </div>
                  <div className="text-sm text-gray-500">
                    Persentase jawaban benar
                  </div>
                </div>
                <span className="text-base font-bold text-gray-900">
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Time Efficiency */}
            {safeResult.time_taken > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-base font-medium text-gray-900">
                      Efisiensi Waktu
                    </div>
                    <div className="text-sm text-gray-500">
                      Rata-rata waktu per soal
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-gray-900">
                      {timePerQuestion}s
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${speedRating.bg} ${speedRating.color} font-medium`}
                    >
                      {speedRating.label}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{
                      width: `${Math.min(100, (120 - timePerQuestion) / 1.2)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Point Efficiency */}
            {safeResult.total_points > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-base font-medium text-gray-900">
                      Efisiensi Poin
                    </div>
                    <div className="text-sm text-gray-500">
                      Poin yang berhasil dikumpulkan
                    </div>
                  </div>
                  <span className="text-base font-bold text-gray-900">
                    {safeResult.earned_points || 0}/{safeResult.total_points}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                    style={{
                      width: `${Math.round(((safeResult.earned_points || 0) / safeResult.total_points) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Improvement Suggestions */}
        <section
          className={`rounded-2xl p-5 mb-6 ${
            isPassed
              ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
              : "bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200"
          }`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl ${getScoreBgColor(percentage)}`}>
              {isPassed ? (
                <StarIcon className="w-6 h-6 text-green-600" />
              ) : (
                <BookOpenIcon className="w-6 h-6 text-orange-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {isPassed
                  ? "Tips untuk Level Selanjutnya"
                  : "Rekomendasi Belajar"}
              </h3>
              <p className="text-sm text-gray-600">
                Berdasarkan performa Anda, berikut saran untuk meningkatkan
                kemampuan:
              </p>
            </div>
          </div>

          <ul className="space-y-3 text-sm">
            {isPassed ? (
              <>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Coba kuis dengan tingkat kesulitan lebih tinggi
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Perbaiki kecepatan mengerjakan soal
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Review soal yang membutuhkan waktu lebih lama
                  </span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Pelajari kembali materi yang kurang dikuasai
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Gunakan fitur 'Coba Lagi' untuk latihan
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Fokus pada penjelasan setiap jawaban
                  </span>
                </li>
              </>
            )}
          </ul>
        </section>
      </main>

      {/* Action Button - Fixed Bottom with Safe Space */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-md mx-auto space-y-3">
          <button
            onClick={() => navigate(`/quiz/${quizId}/play`)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95 text-base"
          >
            <ArrowRightIcon className="w-6 h-6" />
            Coba Kuis Lagi
          </button>

          <button
            onClick={() => navigate("/quiz")}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all active:scale-95 text-sm"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Lihat Kuis Lainnya
          </button>
        </div>
      </div>

      {/* Safe space for bottom button */}
      <div className="h-32"></div>
    </div>
  );
};

export default QuizResultPage;
