const Question = require("../models/question");
const Quiz = require("../models/quiz");

const questionController = {
  getQuestionsByQuiz: async (req, res) => {
    try {
      const { quiz_id } = req.params;
      const result = await Question.getByQuizId(quiz_id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error in getQuestionsByQuiz:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  // Get question by ID
  getQuestionById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Question.getById(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error in getQuestionById:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  // Create question
  createQuestion: async (req, res) => {
    try {
      const questionData = req.body;

      // Validasi data
      if (!questionData.quiz_id || !questionData.question_text) {
        return res.status(400).json({
          success: false,
          message: "Quiz ID dan teks soal harus diisi",
        });
      }

      if (
        questionData.question_type === "multiple_choice" &&
        !questionData.options
      ) {
        return res.status(400).json({
          success: false,
          message: "Pilihan jawaban harus diisi untuk soal pilihan ganda",
        });
      }

      const result = await Question.create(questionData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("Error in createQuestion:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  // Update question
  updateQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const questionData = req.body;

      const result = await Question.update(id, questionData);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error in updateQuestion:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  // Delete question
  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await Question.delete(id);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error in deleteQuestion:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  // Create batch questions
  createBatchQuestions: async (req, res) => {
    try {
      const { quiz_id } = req.params;
      const { questions } = req.body;

      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Data soal harus berupa array dan tidak boleh kosong",
        });
      }

      // Validasi setiap soal
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];

        if (!q.question_text) {
          return res.status(400).json({
            success: false,
            message: `Soal ke-${i + 1}: Teks soal harus diisi`,
          });
        }

        if (q.question_type === "multiple_choice" && !q.options) {
          return res.status(400).json({
            success: false,
            message: `Soal ke-${i + 1}: Pilihan jawaban harus diisi`,
          });
        }
      }

      const result = await Question.createBatch(quiz_id, questions);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("Error in createBatchQuestions:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  // Validate answer
  validateAnswer: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_answer } = req.body;

      if (!user_answer) {
        return res.status(400).json({
          success: false,
          message: "Jawaban user harus diisi",
        });
      }

      const result = await Question.validateAnswer(id, user_answer);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error("Error in validateAnswer:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  // Validate batch answers (for quiz submission)
  validateBatchAnswers: async (req, res) => {
    try {
      const { quiz_id } = req.params;
      const { answers } = req.body;

      if (!answers || typeof answers !== "object") {
        return res.status(400).json({
          success: false,
          message: "Data jawaban harus berupa object",
        });
      }

      const questionsResult = await Question.getByQuizId(quiz_id);

      if (!questionsResult.success) {
        return res.status(404).json(questionsResult);
      }

      const questions = questionsResult.data;
      let totalScore = 0;
      let correctCount = 0;
      const detailedResults = [];

      for (const question of questions) {
        const userAnswer = answers[question.id];
        const isValid = question.correct_answer === userAnswer;
        const questionScore = isValid ? question.points : 0;

        if (isValid) correctCount++;

        totalScore += questionScore;

        detailedResults.push({
          question_id: question.id,
          question_text: question.question_text,
          user_answer: userAnswer,
          correct_answer: question.correct_answer,
          is_correct: isValid,
          points: questionScore,
          explanation: question.explanation,
        });
      }

      const totalQuestions = questions.length;
      const percentage = (correctCount / totalQuestions) * 100;

      res.json({
        success: true,
        message: "Validasi jawaban berhasil",
        data: {
          total_score: totalScore,
          correct_answers: correctCount,
          total_questions: totalQuestions,
          percentage: percentage.toFixed(2),
          detailed_results: detailedResults,
        },
      });
    } catch (error) {
      console.error("Error in validateBatchAnswers:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
};

module.exports = questionController;
