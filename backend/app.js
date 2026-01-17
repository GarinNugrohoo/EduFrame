require("dotenv").config();
const express = require("express");
const router = require("./src/routes/index");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(router);
app.use(cors());

app.get("/", (req, res) => {
  res.send("KONTOL");
});

const PORT = 3000;

app.listen(PORT, () => console.log(`sudah berjalan di port ${PORT}`));
