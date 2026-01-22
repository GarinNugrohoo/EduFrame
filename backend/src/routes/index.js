/*
(KREDIT JANGAN DIHAPUS!!!)
EDUFRAME WEB APP
VERSION : 1.0
DEV BY : GARIN NUGROHO
*/
const cors = require("cors");
const router = require("express").Router();
const users = require("./users");
const materi = require("./materi");
const admins = require("./admins");
const roadmaps = require("./roadmaps");
const quiz = require("./quiz");
const corsOptions = {
  origin: "http://192.168.1.9:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "apikey"],
};

router.use(cors(corsOptions));
router.use("/api/users", users);
router.use("/api/materi", materi);
router.use("/api/admins", admins);
router.use("/api/roadmaps", roadmaps);
router.use("/api/quizzes/", quiz);

module.exports = router;
