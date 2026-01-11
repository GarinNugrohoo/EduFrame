/*
(KREDIT JANGAN DIHAPUS!!!)
EDUFRAME WEB APP
VERSION : 1.0
DEV BY : GARIN NUGROHO
*/

const router = require("express").Router();
const users = require("./users");
const materi = require("./materi");
const admins = require("./admins");

router.use("/api/users", users);
router.use("/api/materi", materi);
router.use("/api/admins", admins);

module.exports = router;
