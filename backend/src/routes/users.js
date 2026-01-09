const router = require("express").Router();
const userController = require("../controllers/usersController");
const apikey = require("../middleware/apikey");

router.use(apikey.validasiApi);

router.get("/users", userController.getAll);
router.get("/user/:id", userController.getById);
router.post("/user/login", userController.login);
router.post("/user/daftar", userController.register);

module.exports = router;
