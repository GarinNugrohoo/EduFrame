const materiModels = require("../models/subjects");

class materi {
  static async getAll(req, res) {
    try {
      const data = await materiModels.getAll();

      if (data.message === "Data tidak ditemukan") {
        return res.status(404).json(data);
      } else if (data.message === "Berhasil mengambil data") {
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

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await materiModels.getById(id);

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

  static async add(req, res) {
    try {
      const { name, code, description, grade_level, semester, color } =
        req.body;
      const data = await materiModels.add({
        name: name,
        code: code,
        description: description,
        grade_level: grade_level,
        semester: semester,
        color: color,
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        server_message: error.message,
      });
    }
  }
}

module.exports = materi;
