const User = require("../models/users");

class userController {
  async getAll(req, res) {
    try {
      const data = await User.getAll();

      if (data.message === "Data tidak ditemukan") {
        return res.status(404).json(data);
      } else if (data.message === "Data ditemukan") {
        return res.status(200).json(data);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await User.getById(id);

      if (data.message === "Data tidak ditemukan") {
        return res.status(404).json(data);
      } else if (data.message === "Data ditemukan") {
        return res.status(200).json(data);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const data = await User.login({
        email: email,
        password: password,
      });

      if (data.message === "Email atau password salah") {
        return res.status(401).json(data);
      } else if (data.message === "Akun berhasil login") {
        return res.status(200).json(data);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const data = await User.register({
        username: username,
        email: email,
        password: password,
      });

      if (data.message === "Email sudah terdaftar") {
        return res.status(500).json(data);
      } else if (data.message === "Username sudah terdaftar") {
        return res.status(500).json(data);
      } else {
        return res.status(200).json(data);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }
}

module.exports = new userController();
