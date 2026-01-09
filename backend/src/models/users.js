const db = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  // Method DAFTAR
  static async register(userData) {
    try {
      const { username, email, password } = userData;
      const [dataUsername] = await db.query(
        "SELECT id FROM users WHERE username = ? LIMIT 1",
        [username]
      );

      if (dataUsername.length > 0) {
        return {
          success: false,
          message: "Username sudah terdaftar",
          existingUserId: dataUsername[0].id,
        };
      }

      const [dataEmail] = await db.query(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
      );

      if (dataEmail.length > 0) {
        return {
          success: false,
          message: "Email sudah terdaftar",
          existingUserId: dataEmail[0].id,
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO users (username, email, password) 
                        VALUES (?, ?, ?)`;
      const result = await db.execute(sql, [username, email, passwordHash]);

      return {
        id: result.insertId,
        username,
        email,
        message: "Berhasil melakukan daftar akun",
      };
    } catch (error) {
      throw error;
    }
  }

  // Method LOGIN
  static async login(userData) {
    try {
      const { email, password } = userData;
      const sql = `SELECT id, username, email, password FROM users 
                        WHERE email = ?`;
      const [data] = await db.query(sql, [email]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Email atau password salah",
        };
      }
      const result = data[0];
      const validPassword = await bcrypt.compare(password, result.password);

      if (validPassword === true) {
        return {
          success: true,
          message: "Akun berhasil login",
        };
      } else {
        return {
          success: false,
          message: "Email atau password salah",
        };
      }
    } catch (error) {
      throw error;
    }
  }

  // Method untuk GET user by ID
  static async getById(id) {
    try {
      const sql = `SELECT id, username, email, created_at 
                        FROM users WHERE id = ?`;
      const [data] = await db.query(sql, [id]);

      if (data.length === 0) {
        return {
          success: false,
          message: "Data tidak ditemukan",
        };
      } else if (data.length > 0) {
        return {
          success: true,
          message: "Data ditemukan",
          data: data[0],
        };
      }
    } catch (error) {
      throw error;
    }
  }

  // Method untuk GET ALL USER
  static async getAll() {
    try {
      const sql = `SELECT id, username, email, created_at FROM users`;
      const [data] = await db.query(sql);

      console.log(data);

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
}

module.exports = User;
