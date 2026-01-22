import axios from "axios";
import { API_URL, API_KEY } from "../constants/api";

const createApiClient = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      apikey: API_KEY,
    },
    withCredentials: true,
    timeout: 10000,
  });
};

const api = createApiClient();

export const getUserId = () => {
  const userString = localStorage.getItem("user");
  if (!userString) return null;

  const user = JSON.parse(userString);
  const userId = user?.id || user?.user_id || user?.userId;
  return userId ? String(userId) : null;
};

export const getQuizResultsFromLocal = () => {
  const results = localStorage.getItem("quiz_results");
  return results ? JSON.parse(results) : [];
};

// Fungsi helper untuk menghapus circular references
const removeCircularReferences = (obj) => {
  const seen = new Set();
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return undefined;
        }
        seen.add(value);
      }
      return value;
    }),
  );
};

export const saveQuizResultToLocal = (quizId, resultData) => {
  try {
    const cleanData = {
      quiz_id: quizId,
      score: resultData.score,
      total_questions: resultData.total_questions,
      correct_answers: resultData.correct_answers,
      total_points: resultData.total_points,
      earned_points: resultData.earned_points || 0,
      time_spent_seconds: resultData.time_spent_seconds,
      answers_data: resultData.answers_data,
      completed_at: resultData.completed_at || new Date().toISOString(),
      saved_at: new Date().toISOString(),
      id: Date.now(),
    };

    const savedResults = getQuizResultsFromLocal();
    savedResults.push(cleanData);

    localStorage.setItem("quiz_results", JSON.stringify(savedResults));
    return true;
  } catch (error) {
    console.error("Error saving to local:", error);
    return false;
  }
};

export const getQuizResultFromLocal = (quizId) => {
  const userId = getUserId();
  if (!userId) return null;

  const key = `quiz_results_${userId}_${quizId}`;
  const result = localStorage.getItem(key);
  return result ? JSON.parse(result) : null;
};

export const getAllUserResultsFromLocal = () => {
  const userId = getUserId();
  if (!userId) return [];

  const key = `quiz_results_${userId}`;
  const results = localStorage.getItem(key);
  return results ? JSON.parse(results) : [];
};

const calculateUserStats = (results) => {
  if (!results || results.length === 0) {
    return {
      success: true,
      data: {
        total_attempts: 0,
        total_score: 0,
        average_score: 0,
        total_correct: 0,
        total_questions: 0,
        accuracy: 0,
      },
    };
  }

  const totalAttempts = results.length;
  const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
  const totalCorrect = results.reduce(
    (sum, r) => sum + (r.correct_answers || 0),
    0,
  );
  const totalQuestions = results.reduce(
    (sum, r) => sum + (r.total_questions || 0),
    0,
  );
  const averageScore =
    totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;
  const accuracy =
    totalQuestions > 0
      ? parseFloat(((totalCorrect / totalQuestions) * 100).toFixed(2))
      : 0;

  return {
    success: true,
    data: {
      total_attempts: totalAttempts,
      total_score: totalScore,
      average_score: averageScore,
      total_correct: totalCorrect,
      total_questions: totalQuestions,
      accuracy: accuracy,
    },
  };
};

const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error.response?.data || error.message);
  return {
    success: false,
    message: defaultMessage,
    data: null,
  };
};

export const quiz = {
  getAllQuizzes: async () => {
    try {
      const response = await api.get("/quizzes");
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil data kuis");
    }
  },

  getQuizById: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil data kuis");
    }
  },

  getQuizzesBySubject: async (subjectId) => {
    try {
      const response = await api.get(`/quizzes/subject/${subjectId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil kuis berdasarkan subject");
    }
  },

  getQuizWithQuestions: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}/with-questions`);

      if (response.data.success && response.data.data) {
        const quizData = response.data.data;
        const questions = quizData.questions || quizData.question || [];

        if (!questions || questions.length === 0) {
          return {
            success: false,
            message: "Kuis tidak memiliki soal",
            data: null,
          };
        }

        if (!quizData.total_questions) {
          quizData.total_questions = questions.length;
        }
      }

      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil soal kuis");
    }
  },

  startQuiz: async (quizId) => {
    try {
      const userId = getUserId();
      if (!userId) {
        return {
          success: false,
          message: "User tidak login",
          data: null,
        };
      }

      const response = await api.post(`/quizzes/${quizId}/start`, {
        user_id: userId,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal memulai kuis");
    }
  },

  submitQuizResult: async (resultData) => {
    try {
      // Bersihkan data dari circular references
      const cleanResultData = removeCircularReferences({
        quiz_id: Number(resultData.quiz_id) || 0,
        score: Number(resultData.score) || 0,
        total_questions: Number(resultData.total_questions) || 0,
        correct_answers: Number(resultData.correct_answers) || 0,
        total_points: Number(resultData.total_points) || 0,
        earned_points: Number(resultData.earned_points) || 0,
        time_spent_seconds: Number(resultData.time_spent_seconds) || 0,
        answers_data:
          typeof resultData.answers_data === "string"
            ? resultData.answers_data
            : JSON.stringify(resultData.answers_data || []),
        completed_at: resultData.completed_at || new Date().toISOString(),
      });

      const userId = getUserId();
      if (!userId) {
        throw new Error("User tidak login");
      }

      const completeData = {
        ...cleanResultData,
        user_id: userId,
      };

      console.log("Data yang dikirim ke API:", completeData);

      const response = await api.post("/quizzes/results/submit", completeData);

      console.log("API Response:", response.data);

      if (response.data.success) {
        saveQuizResultToLocal(resultData.quiz_id, cleanResultData);
      }

      return response.data;
    } catch (error) {
      console.error("Submit API Error:", error.message);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);

      if (error.response?.data) {
        console.error("Server error message:", error.response.data.message);
        console.error("Server error details:", error.response.data.errors);
      }

      // Simpan ke localStorage saja
      const cleanResultData = removeCircularReferences({
        quiz_id: Number(resultData.quiz_id) || 0,
        score: Number(resultData.score) || 0,
        total_questions: Number(resultData.total_questions) || 0,
        correct_answers: Number(resultData.correct_answers) || 0,
        total_points: Number(resultData.total_points) || 0,
        earned_points: Number(resultData.earned_points) || 0,
        time_spent_seconds: Number(resultData.time_spent_seconds) || 0,
        answers_data:
          typeof resultData.answers_data === "string"
            ? resultData.answers_data
            : JSON.stringify(resultData.answers_data || []),
        completed_at: resultData.completed_at || new Date().toISOString(),
        user_id: getUserId(),
        error: error.message,
        saved_locally: true,
      });

      saveQuizResultToLocal(resultData.quiz_id, cleanResultData);
      return {
        success: true,
        message: "Hasil disimpan secara lokal",
        data: cleanResultData,
      };
    }
  },

  getUserResults: async (userId = null) => {
    try {
      const targetUserId = userId || getUserId();
      if (!targetUserId) {
        return {
          success: false,
          message: "User tidak login",
          data: [],
        };
      }

      const response = await api.get(`/quizzes/results/user/${targetUserId}`);

      if (response.data.success && response.data.data) {
        const localResults = getAllUserResultsFromLocal();
        const combinedResults = [...response.data.data];

        localResults.forEach((localResult) => {
          const exists = combinedResults.some(
            (r) => r.id === localResult.id || r.quiz_id === localResult.quiz_id,
          );
          if (!exists) combinedResults.push(localResult);
        });

        return { ...response.data, data: combinedResults };
      }

      return response.data;
    } catch (error) {
      const localResults = getAllUserResultsFromLocal();
      return {
        success: true,
        message: "Data dari localStorage",
        data: localResults,
      };
    }
  },

  getQuizResults: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/results/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil hasil kuis");
    }
  },

  getUserQuizResult: async (quizId) => {
    try {
      const userId = getUserId();
      if (!userId) {
        return {
          success: false,
          message: "User tidak login",
          data: null,
        };
      }

      const response = await api.get(
        `/quizzes/results/quiz/${quizId}/user/${userId}`,
      );

      if (response.data.success) {
        return response.data;
      }

      const localResult = getQuizResultFromLocal(quizId);
      if (localResult) {
        return {
          success: true,
          message: "Data dari localStorage",
          data: localResult,
        };
      }

      return {
        success: false,
        message: "Belum ada hasil untuk kuis ini",
        data: null,
      };
    } catch (error) {
      const localResult = getQuizResultFromLocal(quizId);
      if (localResult) {
        return {
          success: true,
          message: "Data dari localStorage",
          data: localResult,
        };
      }

      return {
        success: false,
        message: "Gagal mengambil hasil kuis",
        data: null,
      };
    }
  },

  getUserStats: async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        return {
          success: false,
          message: "User tidak login",
          data: null,
        };
      }

      const response = await api.get(`/quizzes/results/quiz/${userId}/stats`);

      if (response.data.success) {
        return response.data;
      }

      const localResults = getAllUserResultsFromLocal();
      return calculateUserStats(localResults);
    } catch (error) {
      const localResults = getAllUserResultsFromLocal();
      return calculateUserStats(localResults);
    }
  },

  searchQuizzes: async (keyword) => {
    try {
      const response = await api.get(
        `/quizzes/search?keyword=${encodeURIComponent(keyword)}`,
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mencari kuis");
    }
  },

  getPopularQuizzes: async (limit = 10) => {
    try {
      const response = await api.get(`/quizzes/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil kuis populer");
    }
  },

  getQuizLeaderboard: async (quizId, limit = 10) => {
    try {
      const response = await api.get(
        `/quizzes/results/leaderboard/${quizId}?limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil leaderboard");
    }
  },

  saveQuizProgress: async (quizId, progressData) => {
    try {
      const userId = getUserId();
      if (!userId) return { success: false, message: "User tidak login" };

      const response = await api.post(`/quizzes/${quizId}/progress`, {
        user_id: userId,
        progress_data: JSON.stringify(progressData),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal menyimpan progress");
    }
  },

  getQuizProgress: async (quizId) => {
    try {
      const userId = getUserId();
      if (!userId) return { success: false, message: "User tidak login" };

      const response = await api.get(
        `/quizzes/${quizId}/progress?user_id=${userId}`,
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil progress");
    }
  },
};

export default quiz;
