const router = require("express").Router();
const adminsController = require("../controllers/adminsController");
const apikey = require("../middleware/apikey");

router.use(apikey.validasiApi);

// router.get("/materi", materiController.getAll);
// router.get("/materi/:id", materiController.getById);
// router.post("/materi/add", materiController.add);
// router.post("/user/daftar", userController.register);

module.exports = router;
