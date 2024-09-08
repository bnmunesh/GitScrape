
const dbConfig = require('../config/databaseConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        // operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,

        }
    }
)


sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})



const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./user.js')(sequelize, DataTypes)
db.repository = require('./repository.js')(sequelize, DataTypes)
db.followers = require('./followers.js')(sequelize, DataTypes, db.users)
// console.log("\n\nFollowers:", db.followers)
db.sequelize.sync()
.then(()=> {
    console.log('DB re-sync done!')
})


//1-Many Relationship
db.users.hasMany(db.repository, {
    as: 'repositories',
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    hooks: true
})

db.repository.belongsTo(db.users, {
    as: 'users',
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
})

  
  db.followers.belongsTo(db.users, {
    foreignKey: 'username',  // This will reference the User's primary key (id)
    onDelete: 'CASCADE'
  });




module.exports = db;