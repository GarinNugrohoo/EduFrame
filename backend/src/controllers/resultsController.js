const Result = require("../models/results");
const Quiz = require("../models/quiz");

const resultsController = {
  submitResult: async (req, res) => {
    try {
      const resultData = req.body;

      if (
        !resultData.quiz_id ||
        !resultData.score ||
        !resultData.answers_data
      ) {
        return res.status(400).json({
          success: false,
          message: "Quiz ID, skor, dan data jawaban harus diisi",
        });
      }

      // User ID bisa dari body atau anonymous
      if (!resultData.user_id) {
        resultData.user_id = "anonymous";
      }

      // Check if quiz exists
      const quizCheck = await Quiz.getById(resultData.quiz_id);
      if (!quizCheck.success) {
        return res.status(404).json(quizCheck);
      }

      const result = await Result.create(resultData);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error("Error in submitResult:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getUserResults: async (req, res) => {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "User ID diperlukan",
        });
      }

      const result = await Result.getByUserId(user_id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Error in getUserResults:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getUserStats: async (req, res) => {
    try {
      const { user_id } = req.params;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "User ID diperlukan",
        });
      }

      const result = await Result.getUserStats(user_id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Error in getUserStats:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getUserQuizResult: async (req, res) => {
    try {
      const { quiz_id } = req.params;
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "User ID diperlukan",
        });
      }

      const result = await Result.getUserQuizResult(user_id, quiz_id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Error in getUserQuizResult:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getRecentAttempts: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { limit = 5 } = req.query;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "User ID diperlukan",
        });
      }

      const result = await Result.getRecentAttempts(user_id, parseInt(limit));
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Error in getRecentAttempts:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getQuizStats: async (req, res) => {
    try {
      const { quiz_id } = req.params;
      const result = await Result.getQuizStats(quiz_id);
      return res.json(result);
    } catch (error) {
      console.error("Error in getQuizStats:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getQuizResults: async (req, res) => {
    try {
      const { quiz_id } = req.params;
      const result = await Result.getByQuizId(quiz_id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Error in getQuizResults:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getResultById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Result.getById(id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Error in getResultById:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getLeaderboard: async (req, res) => {
    try {
      const { quiz_id } = req.params;
      const { limit = 10 } = req.query;

      const result = await Result.getLeaderboard(quiz_id, parseInt(limit));
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Error in getLeaderboard:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  deleteResult: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Result.delete(id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Error in deleteResult:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
};

module.exports = resultsController;
