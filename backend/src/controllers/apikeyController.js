const AutoApiKey = require("../utils/autoApi");

class ApiKeyController {
  async buatKeyBaru(req, res) {
    try {
      const { nama, hariUpdate } = req.body;

      const hari = parseInt(hariUpdate) || 7;

      if (hari < 1 || hari > 365) {
        return res.status(400).json({
          sukses: false,
          pesan: "Hari update harus antara 1-365 hari",
        });
      }

      const result = await AutoApiKey.buatKeyAutoUpdate(nama, hari);

      console.log(result);

      res.status(201).json({
        sukses: true,
        data: {
          id: result.id,
          apiKey: result.apiKey,
          kadaluarsa: result.kadaluarsa,
          hariUpdate: result.hariUpdate,
          pesan: "SIMPAN API KEY INI! Tidak bisa dilihat lagi",
        },
      });
    } catch (error) {
      res.status(500).json({
        sukses: false,
        pesan: "Gagal membuat API key",
      });
    }
  }

  async dapatkanKeySaya(req, res) {
    try {
      const userId = req.user.id;
      const keys = AutoApiKey.getKeyUser(userId);

      res.json({
        sukses: true,
        data: keys,
      });
    } catch (error) {
      res.status(500).json({
        sukses: false,
        pesan: "Gagal mengambil data key",
      });
    }
  }

  async updateKeyManual(req, res) {
    try {
      const { keyId } = req.params;
      const userId = req.user.id;

      const result = await AutoApiKey.updateKeyManual(keyId, userId);

      if (result.sukses) {
        res.json({
          sukses: true,
          data: {
            keyBaru: result.keyBaru,
            pesan: result.pesan,
          },
        });
      } else {
        res.status(404).json({
          sukses: false,
          pesan: result.pesan,
        });
      }
    } catch (error) {
      res.status(500).json({
        sukses: false,
        pesan: "Gagal update key",
      });
    }
  }

  async ubahJadwalKey(req, res) {
    try {
      const { keyId } = req.params;
      const { hariBaru } = req.body;
      const userId = req.user.id;

      const hari = parseInt(hariBaru);

      if (hari < 1 || hari > 365) {
        return res.status(400).json({
          sukses: false,
          pesan: "Hari update harus antara 1-365 hari",
        });
      }

      const result = await AutoApiKey.ubahJadwalUpdate(keyId, userId, hari);

      if (result.sukses) {
        res.json({
          sukses: true,
          data: result,
        });
      } else {
        res.status(404).json({
          sukses: false,
          pesan: result.pesan,
        });
      }
    } catch (error) {
      res.status(500).json({
        sukses: false,
        pesan: "Gagal ubah jadwal",
      });
    }
  }

  async nonaktifkanKey(req, res) {
    try {
      const { keyId } = req.params;
      const userId = req.user.id;

      const result = await AutoApiKey.nonaktifkanKey(keyId, userId);

      if (result.sukses) {
        res.json({
          sukses: true,
          pesan: result.pesan,
        });
      } else {
        res.status(404).json({
          sukses: false,
          pesan: result.pesan,
        });
      }
    } catch (error) {
      res.status(500).json({
        sukses: false,
        pesan: "Gagal nonaktifkan key",
      });
    }
  }
}

module.exports = new ApiKeyController();
