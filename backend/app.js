require("dotenv").config();
const express = require("express");
const router = require("./src/routes/index");
const app = express();

app.use(express.json());
app.use(router);

const PORT = 3000;

app.listen(PORT, () => console.log(`sudah berjalan di port ${PORT}`));
