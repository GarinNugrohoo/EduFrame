const fs = require("fs");
const path = require("path");

class ApiKeyMiddleware {
  // Method untuk validasi API key
  static async validasiApiKey(req, res, next) {
    try {
      // 1. Ambil API key dari HEADER (bukan body)
      const apiKey =
        req.headers["x-api-key"] ||
        req.headers["authorization"]?.replace("Bearer ", "") ||
        req.query.api_key;

      // 2. Cek jika API key tidak ada
      if (!apiKey) {
        return res.status(401).json({
          success: false,
          message: "API key diperlukan",
        });
      }

      // 3. Baca file JSON
      const filePath = path.join(__dirname, "../../data/auto_api_keys.json");

      // Cek file exists
      if (!fs.existsSync(filePath)) {
        return res.status(500).json({
          success: false,
          message: "Sistem API key belum siap",
        });
      }

      // Baca file
      const data = fs.readFileSync(filePath, "utf8");
      const apiKeys = JSON.parse(data);

      // 4. Cari API key yang valid
      const validKey = apiKeys.find(
        (item) => item.key === apiKey && item.aktif === true
      );

      // 5. Cek kadaluarsa
      if (validKey) {
        const sekarang = new Date();
        const kadaluarsa = new Date(validKey.kadaluarsa);

        if (sekarang > kadaluarsa) {
          return res.status(401).json({
            success: false,
            message: "API key telah kadaluarsa",
          });
        }

        // 6. Simpan data user ke request
        req.apiKeyData = {
          userId: validKey.userId,
          keyId: validKey.id,
          keyName: validKey.nama,
        };

        next(); // Lanjut ke controller
      } else {
        return res.status(401).json({
          success: false,
          message: "API key tidak valid",
        });
      }
    } catch (error) {
      console.error("Error validasi API:", error);
      return res.status(500).json({
        success: false,
        message: "Kesalahan server saat validasi",
      });
    }
  }

  // Method tambahan: validasi untuk user tertentu
  static hanyaUser(userId) {
    return (req, res, next) => {
      if (req.apiKeyData && req.apiKeyData.userId === userId) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Tidak memiliki akses",
        });
      }
    };
  }

  // Method tambahan: hanya untuk admin
  static hanyaAdmin() {
    return (req, res, next) => {
      // Contoh: cek jika userId adalah admin
      const adminUsers = ["admin123", "superuser"];

      if (req.apiKeyData && adminUsers.includes(req.apiKeyData.userId)) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Hanya admin yang boleh mengakses",
        });
      }
    };
  }
}

module.exports = ApiKeyMiddleware;
