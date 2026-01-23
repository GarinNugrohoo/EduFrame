const db = require("../config/database");

class Result {
  static async create(resultData) {
    try {
      const {
        user_id,
        quiz_id,
        score,
        correct_answers,
        total_questions,
        time_taken,
        answers_data,
      } = resultData;

      const checkQuizQuery = "SELECT id FROM quizzes WHERE id = ?";
      const [quizCheck] = await db.query(checkQuizQuery, [quiz_id]);

      if (quizCheck.length === 0) {
        return {
          success: false,
          message: "Quiz tidak ditemukan",
        };
      }

      let answersDataString = answers_data;
      if (answers_data && typeof answers_data === "object") {
        answersDataString = JSON.stringify(answers_data);
      }

      const query = `
        INSERT INTO quiz_results 
        (user_id, quiz_id, score, correct_answers, total_questions, time_taken, answers_data) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(query, [
        user_id,
        quiz_id,
        score,
        correct_answers,
        total_questions,
        time_taken,
        answersDataString,
      ]);

      await db.query(
        `
        UPDATE quizzes 
        SET participants = participants + 1 
        WHERE id = ?
      `,
        [quiz_id],
      );

      return {
        success: true,
        message: "Hasil quiz berhasil disimpan",
        data: {
          id: result.insertId,
          ...resultData,
        },
      };
    } catch (error) {
      console.error("Error in Result.create:", error);
      return {
        success: false,
        message: "Gagal menyimpan hasil quiz",
        error: error.message,
      };
    }
  }

  static async getByUserId(user_id) {
    try {
      const query = `
        SELECT r.*, q.title as quiz_title, q.category as quiz_category, q.difficulty
        FROM quiz_results r
        LEFT JOIN quizzes q ON r.quiz_id = q.id
        WHERE r.user_id = ?
        ORDER BY r.completed_at DESC
      `;
      const [data] = await db.query(query, [user_id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Tidak ada hasil quiz",
          data: [],
        };
      }

      const results = data.map((result) => {
        if (result.answers_data && typeof result.answers_data === "string") {
          try {
            result.answers_data = JSON.parse(result.answers_data);
          } catch (e) {
            result.answers_data = [];
          }
        }
        return result;
      });

      return {
        success: true,
        message: "Berhasil mengambil hasil quiz",
        data: results,
      };
    } catch (error) {
      console.error("Error in Result.getByUserId:", error);
      return {
        success: false,
        message: "Gagal mengambil hasil quiz",
        error: error.message,
      };
    }
  }

  static async getByQuizId(quiz_id) {
    try {
      const query = `
        SELECT r.*, u.name as user_name, u.email as user_email
        FROM quiz_results r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.quiz_id = ?
        ORDER BY r.score DESC, r.time_taken ASC
      `;
      const [data] = await db.query(query, [quiz_id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Belum ada hasil untuk quiz ini",
          data: [],
        };
      }

      return {
        success: true,
        message: "Berhasil mengambil hasil quiz",
        data: data,
      };
    } catch (error) {
      console.error("Error in Result.getByQuizId:", error);
      return {
        success: false,
        message: "Gagal mengambil hasil quiz",
        error: error.message,
      };
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT r.*, q.title as quiz_title, q.description as quiz_description, 
               q.category, q.difficulty, u.name as user_name
        FROM quiz_results r
        LEFT JOIN quizzes q ON r.quiz_id = q.id
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.id = ?
      `;
      const [data] = await db.query(query, [id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Hasil quiz tidak ditemukan",
          data: null,
        };
      }

      let result = data[0];

      if (result.answers_data && typeof result.answers_data === "string") {
        try {
          result.answers_data = JSON.parse(result.answers_data);
        } catch (e) {
          result.answers_data = [];
        }
      }

      return {
        success: true,
        message: "Berhasil mengambil detail hasil quiz",
        data: result,
      };
    } catch (error) {
      console.error("Error in Result.getById:", error);
      return {
        success: false,
        message: "Gagal mengambil detail hasil quiz",
        error: error.message,
      };
    }
  }

  static async getUserQuizResult(user_id, quiz_id) {
    try {
      const query = `
        SELECT r.*, q.title as quiz_title, q.category
        FROM quiz_results r
        LEFT JOIN quizzes q ON r.quiz_id = q.id
        WHERE r.user_id = ? AND r.quiz_id = ?
        ORDER BY r.completed_at DESC
        LIMIT 1
      `;
      const [data] = await db.query(query, [user_id, quiz_id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Belum ada hasil untuk quiz ini",
          data: null,
        };
      }

      let result = data[0];

      if (result.answers_data && typeof result.answers_data === "string") {
        try {
          result.answers_data = JSON.parse(result.answers_data);
        } catch (e) {
          result.answers_data = [];
        }
      }

      return {
        success: true,
        message: "Berhasil mengambil hasil quiz user",
        data: result,
      };
    } catch (error) {
      console.error("Error in Result.getUserQuizResult:", error);
      return {
        success: false,
        message: "Gagal mengambil hasil quiz user",
        error: error.message,
      };
    }
  }

  static async getUserStats(user_id) {
    try {
      const totalQuery = `
        SELECT 
          COUNT(*) as total_attempts,
          SUM(score) as total_score,
          AVG(score) as average_score,
          SUM(correct_answers) as total_correct,
          SUM(total_questions) as total_questions
        FROM quiz_results 
        WHERE user_id = ?
      `;
      const [totalData] = await db.query(totalQuery, [user_id]);

      if (totalData[0].total_attempts === 0) {
        return {
          success: false,
          message: "Belum ada data statistik",
          data: null,
        };
      }

      const categoryQuery = `
        SELECT 
          q.category,
          COUNT(*) as attempts,
          AVG(r.score) as avg_score,
          MAX(r.score) as best_score
        FROM quiz_results r
        LEFT JOIN quizzes q ON r.quiz_id = q.id
        WHERE r.user_id = ?
        GROUP BY q.category
        ORDER BY attempts DESC
      `;
      const [categoryData] = await db.query(categoryQuery, [user_id]);

      const stats = {
        total_attempts: parseInt(totalData[0].total_attempts) || 0,
        total_score: parseInt(totalData[0].total_score) || 0,
        average_score: parseFloat(totalData[0].average_score) || 0,
        total_correct: parseInt(totalData[0].total_correct) || 0,
        total_questions: parseInt(totalData[0].total_questions) || 0,
        accuracy:
          totalData[0].total_questions > 0
            ? parseFloat(
                (
                  (totalData[0].total_correct / totalData[0].total_questions) *
                  100
                ).toFixed(2),
              )
            : 0,
        categories: categoryData,
      };

      return {
        success: true,
        message: "Berhasil mengambil statistik user",
        data: stats,
      };
    } catch (error) {
      console.error("Error in Result.getUserStats:", error);
      return {
        success: false,
        message: "Gagal mengambil statistik user",
        error: error.message,
      };
    }
  }

  static async getLeaderboard(quiz_id, limit = 10) {
    try {
      const query = `
        SELECT 
          r.*,
          u.name as user_name,
          u.email as user_email,
          RANK() OVER (ORDER BY r.score DESC, r.time_taken ASC) as ranking
        FROM quiz_results r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.quiz_id = ?
        ORDER BY r.score DESC, r.time_taken ASC
        LIMIT ?
      `;
      const [data] = await db.query(query, [quiz_id, limit]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Belum ada data leaderboard",
          data: [],
        };
      }

      return {
        success: true,
        message: "Berhasil mengambil leaderboard",
        data: data,
      };
    } catch (error) {
      console.error("Error in Result.getLeaderboard:", error);
      return {
        success: false,
        message: "Gagal mengambil leaderboard",
        error: error.message,
      };
    }
  }

  static async delete(id) {
    try {
      const checkQuery = "SELECT id FROM quiz_results WHERE id = ?";
      const [checkResult] = await db.query(checkQuery, [id]);

      if (checkResult.length === 0) {
        return {
          success: false,
          message: "Hasil quiz tidak ditemukan",
        };
      }

      const query = "DELETE FROM quiz_results WHERE id = ?";
      await db.query(query, [id]);

      return {
        success: true,
        message: "Hasil quiz berhasil dihapus",
      };
    } catch (error) {
      console.error("Error in Result.delete:", error);
      return {
        success: false,
        message: "Gagal menghapus hasil quiz",
        error: error.message,
      };
    }
  }

  static async getQuizStats(quiz_id) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_participants,
          COALESCE(AVG(score), 0) as average_score,
          COALESCE(MAX(score), 0) as highest_score,
          COALESCE(MIN(score), 0) as lowest_score,
          COALESCE(AVG(time_taken), 0) as average_time_taken,
          COALESCE(SUM(correct_answers), 0) as total_correct,
          COALESCE(SUM(total_questions), 0) as total_questions
        FROM quiz_results 
        WHERE quiz_id = ?
      `;

      const [stats] = await db.query(query, [quiz_id]);

      return {
        success: true,
        message: "Berhasil mengambil statistik quiz",
        data: {
          total_participants: parseInt(stats[0].total_participants) || 0,
          average_score: parseFloat(stats[0].average_score) || 0,
          highest_score: parseInt(stats[0].highest_score) || 0,
          lowest_score: parseInt(stats[0].lowest_score) || 0,
          average_time_taken: parseFloat(stats[0].average_time_taken) || 0,
          total_correct: parseInt(stats[0].total_correct) || 0,
          total_questions: parseInt(stats[0].total_questions) || 0,
          accuracy:
            stats[0].total_questions > 0
              ? parseFloat(
                  (
                    (stats[0].total_correct / stats[0].total_questions) *
                    100
                  ).toFixed(2),
                )
              : 0,
        },
      };
    } catch (error) {
      console.error("Error in Result.getQuizStats:", error);
      return {
        success: false,
        message: "Gagal mengambil statistik quiz",
        error: error.message,
      };
    }
  }

  static async getRecentAttempts(user_id, limit = 5) {
    try {
      const query = `
        SELECT r.*, q.title as quiz_title, q.category, q.difficulty
        FROM quiz_results r
        LEFT JOIN quizzes q ON r.quiz_id = q.id
        WHERE r.user_id = ?
        ORDER BY r.completed_at DESC
        LIMIT ?
      `;
      const [data] = await db.query(query, [user_id, parseInt(limit)]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Tidak ada attempt terbaru",
          data: [],
        };
      }

      return {
        success: true,
        message: "Berhasil mengambil attempt terbaru",
        data: data,
      };
    } catch (error) {
      console.error("Error in Result.getRecentAttempts:", error);
      return {
        success: false,
        message: "Gagal mengambil attempt terbaru",
        error: error.message,
      };
    }
  }
}

module.exports = Result;
