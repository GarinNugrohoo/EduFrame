const db = require("../config/database");

class materiModels {
  static async getAll() {
    try {
      const sql =
        "SELECT id, name, code, description, grade_level, semester, color, created_at FROM subjects";
      const [data] = await db.query(sql);

      if (data.length === 0) {
        return {
          success: false,
          message: "Data tidak ditemukan",
          data: data,
        };
      } else if (data.length > 0) {
        return {
          success: true,
          message: "Berhasil mengambil data",
          data: data,
        };
      }
      console.log(data);
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const sql = `SELECT id, name, code, description, grade_level, semester, color, created_at
                        FROM subjects WHERE id = ?`;

      const [data] = await db.query(sql, [id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Data tidak ditemukan",
          data: data,
        };
      } else if (data.length > 0) {
        return {
          success: true,
          message: "Data ditemukan",
          data: data,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  static async add(dataMateri) {
    try {
      const { name, code, description, grade_level, semester, color } =
        dataMateri;
      const sql = `INSERT INTO subjects (name, code, description, grade_level, semester, color) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
      const [data] = await db.execute(sql, [
        name,
        code,
        description,
        grade_level,
        semester,
        color,
      ]);

      return {
        success: true,
        message: "Data berhasil ditambahkan",
      };
    } catch (error) {
      throw error;
    }
  }

  static async delete() {}
}

module.exports = materiModels;
