const dotenv = require("dotenv")

dotenv.config({path: "./.env"})

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DB = process.env.DB;

module.exports = {
    HOST,
    USER,
    PASSWORD,
    DB
}
