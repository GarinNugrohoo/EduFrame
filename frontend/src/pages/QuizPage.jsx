import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, ClockIcon } from "../components/icons/IkonWrapper";

const QuizPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userResults, setUserResults] = useState({});

  // Data dummy super simple
  const dummyQuizzes = [
    {
      id: 1,
      title: "Quiz Matematika Dasar",
      description: "5 soal matematika dasar",
      subject_id: subjectId || "1",
      total_questions: 5,
      duration_minutes: 10,
    },
    {
      id: 2,
      title: "Quiz Fungsi Sederhana",
      description: "Test pengetahuan fungsi",
      subject_id: subjectId || "1",
      total_questions: 5,
      duration_minutes: 8,
    },
    {
      id: 3,
      title: "Quiz Geometri",
      description: "Soal bentuk geometri",
      subject_id: subjectId || "1",
      total_questions: 5,
      duration_minutes: 12,
    },
  ];

  // Data hasil user (dari localStorage)
  const getUserResults = () => {
    const saved = localStorage.getItem(`quiz_results_${subjectId}`);
    return saved ? JSON.parse(saved) : {};
  };

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setQuizzes(dummyQuizzes);
      setUserResults(getUserResults());
      setLoading(false);
    }, 500);
  }, [subjectId]);

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}/play`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getQuizResult = (quizId) => {
    return userResults[quizId] || null;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Simple */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Kuis</h1>
            <p className="text-xs text-gray-600">Uji pengetahuanmu</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2">Pilih Kuis</h2>
          <p className="text-sm text-gray-600 mb-4">
            Selesaikan kuis untuk menguji pemahamanmu
          </p>
        </div>

        <div className="space-y-4">
          {quizzes.map((quiz) => {
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
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-600">{quiz.description}</p>
                  </div>
                  {hasAttempted && (
                    <div
                      className={`text-sm font-bold ${getScoreColor(score)}`}
                    >
                      {score}%
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{quiz.total_questions} soal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{quiz.duration_minutes} menit</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {hasAttempted ? (
                    <>
                      <button
                        onClick={() => handleStartQuiz(quiz.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Coba Lagi
                      </button>
                      <button
                        onClick={() => navigate(`/quiz/${quiz.id}/result`)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                      >
                        Lihat Hasil
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStartQuiz(quiz.id)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-rose-800"
                    >
                      Mulai Kuis
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Simple */}
        {Object.keys(userResults).length > 0 && (
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-3">Statistikmu</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Kuis Diselesaikan</p>
                <p className="text-xl font-bold text-gray-900">
                  {Object.keys(userResults).length}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Rata-rata Nilai</p>
                <p className="text-xl font-bold text-gray-900">
                  {(() => {
                    const scores = Object.values(userResults).map((result) =>
                      Math.round(
                        (result.correct_answers / result.total_questions) * 100,
                      ),
                    );
                    const average =
                      scores.length > 0
                        ? scores.reduce((a, b) => a + b, 0) / scores.length
                        : 0;
                    return Math.round(average);
                  })()}
                  %
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-2">Tips Mengerjakan:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Baca soal dengan teliti</li>
            <li>• Kerjakan yang mudah dulu</li>
            <li>• Periksa jawaban sebelum kirim</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
