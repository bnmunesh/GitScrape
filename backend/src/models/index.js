
const dbConfig = require('../config/databaseConfig.js');

const {Sequelize, DataTypes} = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    // logging: console.log  // This will log SQL queries
  }
);

// sequelize.authenticate()
// .then(() => {
//     console.log('connected..')
// })
// .catch(err => {
//     console.log('Error'+ err)
// })


const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize

// Read all model files in the current directory except index.js file
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Call associate if it exists in each model and set it up
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    // console.log(`Associated model: ${modelName}`); // This will log each associated model
  }
});

module.exports = db;