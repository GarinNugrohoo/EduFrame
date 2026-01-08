/*
(KREDIT JANGAN DIHAPUS!!!)
EDUFRAME WEB APP
VERSION : 1.0
DEV BY : GARIN NUGROHO
*/

const router = require("express").Router();
const users = require("./users");
const apikey = require("./apikey");

router.use("/api/", users);
router.use("/api/", apikey);

module.exports = router;
