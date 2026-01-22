import axios from "axios";
import { API_URL, API_KEY } from "../constants/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    apikey: API_KEY,
  },
  withCredentials: true,
  timeout: 15000,
});

const getUserId = () => {
  try {
    const userString = localStorage.getItem("user");
    if (!userString) return null;

    const user = JSON.parse(userString);
    const userId = user?.id || user?.user_id || user?.userId;

    if (!userId) return null;

    return String(userId);
  } catch (error) {
    return null;
  }
};

const getQuizResultsFromLocal = (userId = null) => {
  try {
    const targetUserId = userId || getUserId() || "anonymous";
    const storageKey = `quiz_results_${targetUserId}`;

    const results = localStorage.getItem(storageKey);
    if (!results) return [];

    const parsedResults = JSON.parse(results);
    return Array.isArray(parsedResults) ? parsedResults : [];
  } catch (error) {
    return [];
  }
};

const saveQuizResultToLocal = (resultData) => {
  try {
    const userId = resultData.user_id || getUserId() || "anonymous";
    const storageKey = `quiz_results_${userId}`;

    const cleanData = {
      quiz_id: Number(resultData.quiz_id) || 0,
      user_id: userId,
      score: Number(resultData.score) || 0,
      total_questions: Number(resultData.total_questions) || 0,
      correct_answers: Number(resultData.correct_answers) || 0,
      total_points: Number(resultData.total_points) || 0,
      earned_points: Number(resultData.earned_points) || 0,
      time_taken:
        Number(resultData.time_taken) ||
        Number(resultData.time_spent_seconds) ||
        0,
      answers_data:
        typeof resultData.answers_data === "string"
          ? resultData.answers_data
          : JSON.stringify(resultData.answers_data || []),
      completed_at: resultData.completed_at || new Date().toISOString(),
      saved_at: new Date().toISOString(),
      id: Date.now(),
      server_saved: resultData.server_saved || false,
      error: resultData.error || null,
    };

    const savedResults = JSON.parse(localStorage.getItem(storageKey) || "[]");
    savedResults.push(cleanData);

    localStorage.setItem(storageKey, JSON.stringify(savedResults));

    return true;
  } catch (error) {
    return false;
  }
};

const handleApiError = (error, defaultMessage) => {
  const errorResponse = {
    success: false,
    message: defaultMessage,
    data: null,
    error: error.message,
  };

  if (error.response) {
    errorResponse.status = error.response.status;
    errorResponse.data = error.response.data;
  } else if (error.request) {
    errorResponse.message = "Tidak ada response dari server";
  }

  return errorResponse;
};

const validateQuizData = (data) => {
  const errors = [];
  const userId = getUserId();

  if (!data.quiz_id || Number(data.quiz_id) <= 0) {
    errors.push("Quiz ID harus diisi");
  }

  if (
    data.score === undefined ||
    data.score === null ||
    isNaN(Number(data.score))
  ) {
    errors.push("Score harus diisi");
  }

  if (!data.answers_data) {
    errors.push("Data jawaban harus diisi");
  } else if (typeof data.answers_data === "string") {
    try {
      JSON.parse(data.answers_data);
    } catch {
      errors.push("Data jawaban tidak valid");
    }
  }

  if (!userId) {
    errors.push("User tidak login");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    validatedData: {
      quiz_id: Number(data.quiz_id) || 0,
      user_id: userId,
      score: Number(data.score) || 0,
      total_questions: Number(data.total_questions) || 0,
      correct_answers: Number(data.correct_answers) || 0,
      total_points: Number(data.total_points) || 0,
      earned_points: Number(data.earned_points) || 0,
      time_taken:
        Number(data.time_taken) || Number(data.time_spent_seconds) || 0,
      answers_data:
        typeof data.answers_data === "string"
          ? data.answers_data
          : JSON.stringify(data.answers_data || []),
      completed_at: data.completed_at || new Date().toISOString(),
    },
  };
};

const calculateStatsFromLocal = (localResults) => {
  if (!localResults || localResults.length === 0) {
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

  const totalAttempts = localResults.length;
  const totalScore = localResults.reduce((sum, r) => sum + (r.score || 0), 0);
  const totalCorrect = localResults.reduce(
    (sum, r) => sum + (r.correct_answers || 0),
    0,
  );
  const totalQuestions = localResults.reduce(
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
      const validation = validateQuizData(resultData);

      if (!validation.isValid) {
        const errorData = {
          ...validation.validatedData,
          error: validation.errors.join(", "),
          server_saved: false,
        };

        saveQuizResultToLocal(errorData);

        return {
          success: false,
          message: validation.errors.join(", "),
          data: errorData,
        };
      }

      const response = await api.post(
        "/quizzes/results/submit",
        validation.validatedData,
      );

      if (response.data && response.data.success) {
        const successData = {
          ...validation.validatedData,
          server_saved: true,
          server_id: response.data.data?.id || null,
        };

        saveQuizResultToLocal(successData);

        return {
          ...response.data,
          data: successData,
        };
      } else {
        const errorData = {
          ...validation.validatedData,
          error: response.data?.message || "Unknown server error",
          server_saved: false,
        };

        saveQuizResultToLocal(errorData);

        return {
          success: false,
          message: response.data?.message || "Unknown server error",
          data: errorData,
        };
      }
    } catch (error) {
      const errorData = {
        quiz_id: Number(resultData.quiz_id) || 0,
        user_id: resultData.user_id || getUserId(),
        score: Number(resultData.score) || 0,
        total_questions: Number(resultData.total_questions) || 0,
        correct_answers: Number(resultData.correct_answers) || 0,
        total_points: Number(resultData.total_points) || 0,
        earned_points: Number(resultData.earned_points) || 0,
        time_taken:
          Number(resultData.time_taken) ||
          Number(resultData.time_spent_seconds) ||
          0,
        answers_data:
          typeof resultData.answers_data === "string"
            ? resultData.answers_data
            : JSON.stringify(resultData.answers_data || []),
        completed_at: resultData.completed_at || new Date().toISOString(),
        error: error.response?.data?.message || error.message,
        server_saved: false,
      };

      saveQuizResultToLocal(errorData);

      return {
        success: true,
        message: "Hasil disimpan secara lokal karena server error",
        data: errorData,
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

      if (response.data.success) {
        return response.data;
      }

      const localResults = getQuizResultsFromLocal(targetUserId);
      return {
        success: true,
        message: "Data dari localStorage",
        data: localResults,
      };
    } catch (error) {
      const targetUserId = userId || getUserId();
      const localResults = getQuizResultsFromLocal(targetUserId);
      return {
        success: true,
        message: "Data dari localStorage",
        data: localResults,
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

      const response = await api.get(`/quizzes/results/user/${userId}/stats`);

      if (response.data.success) {
        return response.data;
      }

      const localResults = getQuizResultsFromLocal(userId);
      return calculateStatsFromLocal(localResults);
    } catch (error) {
      const userId = getUserId();
      const localResults = getQuizResultsFromLocal(userId);
      return calculateStatsFromLocal(localResults);
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
        `/quizzes/results/quiz/${quizId}/user-result?user_id=${userId}`,
      );

      if (response.data.success) {
        return response.data;
      }

      const localResults = getQuizResultsFromLocal(userId);
      const localResult = localResults.find(
        (r) => r.quiz_id === Number(quizId),
      );

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
      const userId = getUserId();
      const localResults = getQuizResultsFromLocal(userId);
      const localResult = localResults.find(
        (r) => r.quiz_id === Number(quizId),
      );

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

  getQuizResults: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/results/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil hasil kuis");
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

  getQuizLeaderboard: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}/leaderboard`);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil leaderboard");
    }
  },

  getResultsLeaderboard: async (quizId, limit = 10) => {
    try {
      const response = await api.get(
        `/quizzes/results/leaderboard/${quizId}?limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, "Gagal mengambil leaderboard");
    }
  },
};

export default quiz;
