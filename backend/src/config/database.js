/*
(KREDIT JANGAN DIHAPUS!!!)
EDUFRAME WEB APP
VERSION : 1.0
DEV BY : GARIN NUGROHO
*/

require("dotenv").config();
const mysql = require("mysql2/promise");

const databaseConfig = {
  host: process.env.HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
};

const pool = mysql.createPool(databaseConfig);

const testingDB = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log("Koneksi berhasil!");
  } catch (error) {
    console.log(`Koneksi gagal dikarenakan : ${error}`);
  }
};

testingDB();
module.exports = pool;
