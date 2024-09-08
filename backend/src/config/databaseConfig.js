const { HOST, USER, PASSWORD, DB } = require(".");

module.exports = {
    HOST ,
    USER,
    PASSWORD,
    DB,
    dialect: 'mysql',
    
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
}