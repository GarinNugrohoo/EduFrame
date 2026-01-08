const express = require("express");
const router = express.Router();
const ApiKeyController = require("../controllers/apikeyController");

router.post("/buat", ApiKeyController.buatKeyBaru);
router.get("/saya", ApiKeyController.dapatkanKeySaya);
router.put("/:keyId/update", ApiKeyController.updateKeyManual);
router.put("/:keyId/jadwal", ApiKeyController.ubahJadwalKey);
router.put("/:keyId/nonaktif", ApiKeyController.nonaktifkanKey);

module.exports = router;
