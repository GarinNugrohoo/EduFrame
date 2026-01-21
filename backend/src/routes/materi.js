/*
(KREDIT JANGAN DIHAPUS!!!)
EDUFRAME WEB APP
VERSION : 1.0
DEV BY : GARIN NUGROHO
*/

const router = require("express").Router();
const materiController = require("../controllers/subjectsController");
const apikey = require("../middleware/apikey");

router.use(apikey.validasiApi);

router.get("/", materiController.getAll);
router.get("/materi/:id", materiController.getById);
router.post("/materi/add", materiController.add);

module.exports = router;
