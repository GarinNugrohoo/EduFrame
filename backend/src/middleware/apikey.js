require("dotenv").config();

class apiKey {
  static validasiApi(req, res, next) {
    const { apikey } = req.headers;
    const token = process.env.TOKEN;

    if (!apikey) {
      return res.status(401).json({
        success: false,
        message: "Apikey tidak boleh kosong",
      });
    } else if (apikey != token) {
      return res.status(401).json({
        success: false,
        message: "Tidak valid",
      });
    }
    next();
  }
}

module.exports = apiKey;
