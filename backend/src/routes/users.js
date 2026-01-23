const router = require("express").Router();
const userController = require("../controllers/usersController");
const apikey = require("../middleware/apikey");

router.use(apikey.validasiApi);

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/login", userController.login);
router.post("/daftar", userController.register);

module.exports = router;
