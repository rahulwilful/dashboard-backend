const mysql = require("mysql");
const dotenv = require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.log("error : ", err);
  } else {
    console.log("connected to  database in config");
  }
});

module.exports = db;
