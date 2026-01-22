const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Result = require("../models/results");

const quizController = {
  getAllQuizzes: async (req, res) => {
    try {
      const result = await Quiz.getAll();

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error in getAllQuizzes:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getQuizById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Quiz.getById(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error in getQuizById:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getQuizzesBySubject: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const result = await Quiz.getBySubjectId(subject_id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error in getQuizzesBySubject:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  createQuiz: async (req, res) => {
    try {
      const quizData = req.body;

      if (!quizData.subject_id || !quizData.title || !quizData.description) {
        return res.status(400).json({
          success: false,
          message: "Subject ID, judul, dan deskripsi harus diisi",
        });
      }

      const result = await Quiz.create(quizData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("Error in createQuiz:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  updateQuiz: async (req, res) => {
    try {
      const { id } = req.params;
      const quizData = req.body;

      const result = await Quiz.update(id, quizData);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error in updateQuiz:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  deleteQuiz: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await Quiz.delete(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error in deleteQuiz:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  searchQuizzes: async (req, res) => {
    try {
      const { keyword } = req.query;

      if (!keyword || keyword.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Keyword pencarian harus diisi",
        });
      }

      const result = await Quiz.search(keyword);
      res.json(result);
    } catch (error) {
      console.error("Error in searchQuizzes:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getPopularQuizzes: async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const result = await Quiz.getPopular(parseInt(limit));
      res.json(result);
    } catch (error) {
      console.error("Error in getPopularQuizzes:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getQuizWithQuestions: async (req, res) => {
    try {
      const { id } = req.params;
      const quizResult = await Quiz.getById(id);

      if (!quizResult.success) {
        return res.status(404).json(quizResult);
      }

      const questionsResult = await Question.getByQuizId(id);
      const responseData = {
        ...quizResult.data,
        questions: questionsResult.data || [],
      };

      res.json({
        success: true,
        message: "Berhasil mengambil quiz dengan soal",
        data: responseData,
      });
    } catch (error) {
      console.error("Error in getQuizWithQuestions:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  getQuizLeaderboard: async (req, res) => {
    try {
      const { id } = req.params;
      const { limit = 10 } = req.query;
      const quizCheck = await Quiz.getById(id);

      if (!quizCheck.success) {
        return res.status(404).json(quizCheck);
      }

      const result = await Result.getLeaderboard(id, parseInt(limit));
      res.json(result);
    } catch (error) {
      console.error("Error in getQuizLeaderboard:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  startQuiz: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id || "anonymous";
      const quizResult = await Quiz.getById(id);

      if (!quizResult.success) {
        return res.status(404).json(quizResult);
      }

      const quiz = quizResult.data;

      if (!quiz.is_active) {
        return res.status(400).json({
          success: false,
          message: "Quiz tidak aktif",
        });
      }

      const questionsResult = await Question.getByQuizId(id);
      const questions = questionsResult.data.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        points: q.points,
        order_index: q.order_index,
      }));

      const quizSession = {
        quiz_id: id,
        user_id: userId,
        start_time: new Date().toISOString(),
        quiz_data: {
          title: quiz.title,
          description: quiz.description,
          total_questions: quiz.total_questions,
          duration_minutes: quiz.duration_minutes,
          questions: questions,
        },
      };

      await Quiz.incrementParticipants(id);

      res.json({
        success: true,
        message: "Quiz session dimulai",
        data: quizSession,
      });
    } catch (error) {
      console.error("Error in startQuiz:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
};

module.exports = quizController;
