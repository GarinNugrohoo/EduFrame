const db = require("../config/database");

class Question {
  static async getByQuizId(quiz_id) {
    try {
      const query = `
        SELECT q.* 
        FROM questions q
        WHERE q.quiz_id = ?
        ORDER BY q.order_index, q.created_at
      `;
      const [data] = await db.query(query, [quiz_id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Soal untuk quiz ini tidak ditemukan",
          data: [],
        };
      }

      // Parse options JSON if it's stored as JSON string
      const questions = data.map((question) => {
        if (question.options && typeof question.options === "string") {
          try {
            question.options = JSON.parse(question.options);
          } catch (e) {
            question.options = [];
          }
        }
        return question;
      });

      return {
        success: true,
        message: "Berhasil mengambil data soal",
        data: questions,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = "SELECT * FROM questions WHERE id = ?";
      const [data] = await db.query(query, [id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Soal tidak ditemukan",
          data: null,
        };
      }

      let question = data[0];

      // Parse options JSON
      if (question.options && typeof question.options === "string") {
        try {
          question.options = JSON.parse(question.options);
        } catch (e) {
          question.options = [];
        }
      }

      return {
        success: true,
        message: "Berhasil mengambil data soal",
        data: question,
      };
    } catch (error) {
      throw error;
    }
  }

  static async create(questionData) {
    try {
      const {
        quiz_id,
        question_text,
        question_type = "multiple_choice",
        options,
        correct_answer,
        explanation,
        points = 10,
        order_index = 0,
      } = questionData;

      // Check if quiz exists
      const checkQuizQuery = "SELECT id FROM quizzes WHERE id = ?";
      const [quizCheck] = await db.query(checkQuizQuery, [quiz_id]);

      if (quizCheck.length === 0) {
        return {
          success: false,
          message: "Quiz tidak ditemukan",
        };
      }

      // Stringify options if it's an array/object
      let optionsString = options;
      if (options && typeof options === "object") {
        optionsString = JSON.stringify(options);
      }

      const query = `
        INSERT INTO questions 
        (quiz_id, question_text, question_type, options, correct_answer, explanation, points, order_index) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(query, [
        quiz_id,
        question_text,
        question_type,
        optionsString,
        correct_answer,
        explanation,
        points,
        order_index,
      ]);

      return {
        success: true,
        message: "Soal berhasil dibuat",
        data: {
          id: result.insertId,
          ...questionData,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, questionData) {
    try {
      const {
        quiz_id,
        question_text,
        question_type,
        options,
        correct_answer,
        explanation,
        points,
        order_index,
      } = questionData;

      // Check if question exists
      const checkQuery = "SELECT id FROM questions WHERE id = ?";
      const [checkResult] = await db.query(checkQuery, [id]);

      if (checkResult.length === 0) {
        return {
          success: false,
          message: "Soal tidak ditemukan",
        };
      }

      if (quiz_id) {
        const checkQuizQuery = "SELECT id FROM quizzes WHERE id = ?";
        const [quizCheck] = await db.query(checkQuizQuery, [quiz_id]);

        if (quizCheck.length === 0) {
          return {
            success: false,
            message: "Quiz tidak ditemukan",
          };
        }
      }

      let updateFields = [];
      let values = [];

      if (quiz_id !== undefined) {
        updateFields.push("quiz_id = ?");
        values.push(quiz_id);
      }

      if (question_text !== undefined) {
        updateFields.push("question_text = ?");
        values.push(question_text);
      }

      if (question_type !== undefined) {
        updateFields.push("question_type = ?");
        values.push(question_type);
      }

      if (options !== undefined) {
        // Stringify options if it's an array/object
        let optionsString = options;
        if (options && typeof options === "object") {
          optionsString = JSON.stringify(options);
        }
        updateFields.push("options = ?");
        values.push(optionsString);
      }

      if (correct_answer !== undefined) {
        updateFields.push("correct_answer = ?");
        values.push(correct_answer);
      }

      if (explanation !== undefined) {
        updateFields.push("explanation = ?");
        values.push(explanation);
      }

      if (points !== undefined) {
        updateFields.push("points = ?");
        values.push(points);
      }

      if (order_index !== undefined) {
        updateFields.push("order_index = ?");
        values.push(order_index);
      }

      if (updateFields.length === 0) {
        return {
          success: false,
          message: "Tidak ada data yang diperbarui",
        };
      }

      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);

      const query = `UPDATE questions SET ${updateFields.join(", ")} WHERE id = ?`;

      await db.query(query, values);

      return {
        success: true,
        message: "Soal berhasil diperbarui",
      };
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Check if question exists
      const checkQuery = "SELECT id FROM questions WHERE id = ?";
      const [checkResult] = await db.query(checkQuery, [id]);

      if (checkResult.length === 0) {
        return {
          success: false,
          message: "Soal tidak ditemukan",
        };
      }

      const query = "DELETE FROM questions WHERE id = ?";
      await db.query(query, [id]);

      return {
        success: true,
        message: "Soal berhasil dihapus",
      };
    } catch (error) {
      throw error;
    }
  }

  static async createBatch(quiz_id, questions) {
    try {
      // Check if quiz exists
      const checkQuizQuery = "SELECT id FROM quizzes WHERE id = ?";
      const [quizCheck] = await db.query(checkQuizQuery, [quiz_id]);

      if (quizCheck.length === 0) {
        return {
          success: false,
          message: "Quiz tidak ditemukan",
        };
      }

      const insertedQuestions = [];

      for (let i = 0; i < questions.length; i++) {
        const questionData = questions[i];

        const {
          question_text,
          question_type = "multiple_choice",
          options,
          correct_answer,
          explanation,
          points = 10,
        } = questionData;

        // Stringify options
        let optionsString = options;
        if (options && typeof options === "object") {
          optionsString = JSON.stringify(options);
        }

        const query = `
          INSERT INTO questions 
          (quiz_id, question_text, question_type, options, correct_answer, explanation, points, order_index) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
          quiz_id,
          question_text,
          question_type,
          optionsString,
          correct_answer,
          explanation,
          points,
          i,
        ]);

        insertedQuestions.push({
          id: result.insertId,
          ...questionData,
          order_index: i,
        });
      }

      return {
        success: true,
        message: `${insertedQuestions.length} soal berhasil ditambahkan`,
        data: insertedQuestions,
      };
    } catch (error) {
      throw error;
    }
  }

  static async validateAnswer(question_id, user_answer) {
    try {
      const questionResult = await this.getById(question_id);

      if (!questionResult.success) {
        return questionResult;
      }

      const question = questionResult.data;
      const is_correct = question.correct_answer === user_answer;

      return {
        success: true,
        message: "Validasi jawaban berhasil",
        data: {
          is_correct,
          correct_answer: question.correct_answer,
          explanation: question.explanation,
          points: is_correct ? question.points : 0,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Question;
