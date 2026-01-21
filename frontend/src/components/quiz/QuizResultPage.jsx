import React from "react";
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

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams();

  const result = location.state?.result || {
    quizId: quizId,
    score: 60,
    total_questions: 30,
    correct_answers: 18,
    time_spent_seconds: 900,
    earned_points: 180,
    total_points: 300,
  };

  const percentage = Math.round(
    (result.correct_answers / result.total_questions) * 100,
  );
  const isPassed = percentage >= 60;
  const wrongAnswers = result.total_questions - result.correct_answers;
  const timePerQuestion = (
    result.time_spent_seconds / result.total_questions
  ).toFixed(1);

  const formatTime = (seconds) => {
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
              Evaluasi Performa Belajar
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
                    {result.correct_answers}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    dari {result.total_questions} soal
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
                    dari {result.total_questions} soal
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
                    {formatTime(result.time_spent_seconds)}
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

            {/* Point Efficiency */}
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
                  {result.earned_points || 0}/
                  {result.total_points || result.total_questions * 10}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                  style={{
                    width: `${Math.round(((result.earned_points || 0) / (result.total_points || result.total_questions * 10)) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
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
                {/* <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    Fokus pada penjelasan setiap jawaban
                  </span>
                </li> */}
              </>
            )}
          </ul>
        </section>
      </main>

      {/* Action Button - Fixed Bottom with Safe Space */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate(`/quiz/${quizId}/play`)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95 text-base"
          >
            <ArrowRightIcon className="w-6 h-6" />
            Coba Kuis Lagi
          </button>
        </div>
      </div>

      {/* Safe space for bottom button */}
      <div className="h-20"></div>
    </div>
  );
};

export default QuizResultPage;
