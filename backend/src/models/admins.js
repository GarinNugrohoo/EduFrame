const db = require("../config/database");
const bcrypt = require("bcrypt");

class admins {
  static async register(adminData) {
    try {
      const { username, email, password } = adminData;
      const sqlCheckName = "SELECT id FROM admins WHERE username = ? LIMIT 1";
      const dataCheckName = await db.query(sqlCheckName, [username]);

      if (dataCheckName.length > 0) {
        return {
          success: false,
          message: "Data sudah digunakan",
        };
      }

      const sqlCheckEmail = "SELECT id FROM admins WHERE username = ? LIMIT 1";

      const passwordHash = bcrypt.hash(password, 10);
      const sql = `INSERT INTO users (username, email, password) 
                        VALUES (?, ?, ?)`;

      const data = await db.execute(sql, [passwordHash]);

      return {
        success: true,
        message: "Registrasi berhasil",
        data: data,
      };
    } catch (error) {}
  }
}

module.exports = admins;
