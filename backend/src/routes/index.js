/*
(KREDIT JANGAN DIHAPUS!!!)
EDUFRAME WEB APP
VERSION : 1.0
DEV BY : GARIN NUGROHO
*/

const router = require("express").Router();
const users = require("./users");
const materi = require("./materi");

router.use("/api", users);
router.use("/api/v1", materi);

module.exports = router;
