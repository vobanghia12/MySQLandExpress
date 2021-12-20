const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost", // our host
  database: "blog", //we can connect multiple databases
  user: "root", // root is the name of user
  password: "stupid12", // password when you log into database
}); //connect database

module.exports = pool;
