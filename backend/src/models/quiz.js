const db = require("../config/database");

class Quiz {
  static async getAll() {
    try {
      const query = `
        SELECT q.*, s.name as subject_name, s.code as subject_code 
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.id
        ORDER BY q.created_at DESC
      `;
      const [data] = await db.query(query);

      if (data.length === 0) {
        return {
          success: false,
          message: "Data quiz tidak ditemukan",
          data: [],
        };
      }

      return {
        success: true,
        message: "Berhasil mengambil data quiz",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = `
        SELECT q.*, s.name as subject_name, s.code as subject_code 
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.id
        WHERE q.id = ?
      `;
      const [data] = await db.query(query, [id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Quiz tidak ditemukan",
          data: null,
        };
      }

      const countQuery = `SELECT COUNT(*) as total_questions FROM questions WHERE quiz_id = ?`;
      const [countResult] = await db.query(countQuery, [id]);

      const quiz = data[0];
      quiz.total_questions = countResult[0].total_questions;

      return {
        success: true,
        message: "Berhasil mengambil data quiz",
        data: quiz,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getBySubjectId(subject_id) {
    try {
      const query = `
        SELECT q.*, s.name as subject_name, s.code as subject_code 
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.id
        WHERE q.subject_id = ?
        ORDER BY q.title
      `;
      const [data] = await db.query(query, [subject_id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Quiz untuk subject ini tidak ditemukan",
          data: [],
        };
      }

      for (let quiz of data) {
        const countQuery = `SELECT COUNT(*) as total_questions FROM questions WHERE quiz_id = ?`;
        const [countResult] = await db.query(countQuery, [quiz.id]);
        quiz.total_questions = countResult[0].total_questions;
      }

      return {
        success: true,
        message: "Berhasil mengambil data quiz",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  static async create(quizData) {
    try {
      const {
        subject_id,
        title,
        description,
        category,
        difficulty = "Medium",
        duration_minutes = 15,
        points = 100,
        is_active = true,
      } = quizData;

      const checkSubjectQuery = "SELECT id FROM subjects WHERE id = ?";
      const [subjectCheck] = await db.query(checkSubjectQuery, [subject_id]);

      if (subjectCheck.length === 0) {
        return {
          success: false,
          message: "Subject tidak ditemukan",
        };
      }

      const query = `
        INSERT INTO quizzes 
        (subject_id, title, description, category, difficulty, duration_minutes, points, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(query, [
        subject_id,
        title,
        description,
        category,
        difficulty,
        duration_minutes,
        points,
        is_active,
      ]);

      return {
        success: true,
        message: "Quiz berhasil dibuat",
        data: {
          id: result.insertId,
          ...quizData,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, quizData) {
    try {
      const {
        subject_id,
        title,
        description,
        category,
        difficulty,
        duration_minutes,
        points,
        is_active,
      } = quizData;

      const checkQuery = "SELECT id FROM quizzes WHERE id = ?";
      const [checkResult] = await db.query(checkQuery, [id]);

      if (checkResult.length === 0) {
        return {
          success: false,
          message: "Quiz tidak ditemukan",
        };
      }

      if (subject_id) {
        const checkSubjectQuery = "SELECT id FROM subjects WHERE id = ?";
        const [subjectCheck] = await db.query(checkSubjectQuery, [subject_id]);

        if (subjectCheck.length === 0) {
          return {
            success: false,
            message: "Subject tidak ditemukan",
          };
        }
      }

      let updateFields = [];
      let values = [];

      if (subject_id !== undefined) {
        updateFields.push("subject_id = ?");
        values.push(subject_id);
      }

      if (title !== undefined) {
        updateFields.push("title = ?");
        values.push(title);
      }

      if (description !== undefined) {
        updateFields.push("description = ?");
        values.push(description);
      }

      if (category !== undefined) {
        updateFields.push("category = ?");
        values.push(category);
      }

      if (difficulty !== undefined) {
        updateFields.push("difficulty = ?");
        values.push(difficulty);
      }

      if (duration_minutes !== undefined) {
        updateFields.push("duration_minutes = ?");
        values.push(duration_minutes);
      }

      if (points !== undefined) {
        updateFields.push("points = ?");
        values.push(points);
      }

      if (is_active !== undefined) {
        updateFields.push("is_active = ?");
        values.push(is_active);
      }

      if (updateFields.length === 0) {
        return {
          success: false,
          message: "Tidak ada data yang diperbarui",
        };
      }

      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);

      const query = `UPDATE quizzes SET ${updateFields.join(", ")} WHERE id = ?`;

      await db.query(query, values);

      return {
        success: true,
        message: "Quiz berhasil diperbarui",
      };
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const checkQuery = "SELECT id FROM quizzes WHERE id = ?";
      const [checkResult] = await db.query(checkQuery, [id]);

      if (checkResult.length === 0) {
        return {
          success: false,
          message: "Quiz tidak ditemukan",
        };
      }
      await db.query("DELETE FROM questions WHERE quiz_id = ?", [id]);
      const query = "DELETE FROM quizzes WHERE id = ?";
      await db.query(query, [id]);

      return {
        success: true,
        message: "Quiz berhasil dihapus",
      };
    } catch (error) {
      throw error;
    }
  }

  static async getByCategory(category) {
    try {
      const query = `
        SELECT q.*, s.name as subject_name, s.code as subject_code 
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.id
        WHERE q.category = ? AND q.is_active = TRUE
        ORDER BY q.title
      `;
      const [data] = await db.query(query, [category]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Quiz dengan kategori ini tidak ditemukan",
          data: [],
        };
      }

      return {
        success: true,
        message: "Berhasil mengambil data quiz berdasarkan kategori",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getByDifficulty(difficulty) {
    try {
      const query = `
        SELECT q.*, s.name as subject_name, s.code as subject_code 
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.id
        WHERE q.difficulty = ? AND q.is_active = TRUE
        ORDER BY q.title
      `;
      const [data] = await db.query(query, [difficulty]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Quiz dengan tingkat kesulitan ini tidak ditemukan",
          data: [],
        };
      }

      return {
        success: true,
        message: "Berhasil mengambil data quiz berdasarkan tingkat kesulitan",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  static async search(keyword) {
    try {
      const searchTerm = `%${keyword}%`;
      const query = `
        SELECT q.*, s.name as subject_name, s.code as subject_code 
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.id
        WHERE (q.title LIKE ? OR q.description LIKE ? OR q.category LIKE ?)
        AND q.is_active = TRUE
        ORDER BY q.title
      `;
      const [data] = await db.query(query, [
        searchTerm,
        searchTerm,
        searchTerm,
      ]);

      return {
        success: true,
        message: "Berhasil mencari quiz",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  static async incrementParticipants(quizId) {
    try {
      const query = `
        UPDATE quizzes 
        SET participants = participants + 1, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      await db.query(query, [quizId]);

      return {
        success: true,
        message: "Jumlah peserta berhasil ditambah",
      };
    } catch (error) {
      throw error;
    }
  }

  static async getPopular(limit = 10) {
    try {
      const query = `
        SELECT q.*, s.name as subject_name, s.code as subject_code 
        FROM quizzes q
        LEFT JOIN subjects s ON q.subject_id = s.id
        WHERE q.is_active = TRUE
        ORDER BY q.participants DESC, q.created_at DESC
        LIMIT ?
      `;
      const [data] = await db.query(query, [limit]);

      return {
        success: true,
        message: "Berhasil mengambil quiz populer",
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Quiz;
