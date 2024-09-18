module.exports = (sequelize, DataTypes) => {
    const Follower = sequelize.define('Follower', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      follower_username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar_url: {
        type: DataTypes.STRING
      },
      isFriend:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    }, {
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['username', 'follower_username']
        }
      ]
    });
  
    Follower.associate = function(models) {
      Follower.belongsTo(models.User, {
        foreignKey: 'username',
        as: 'user',
        onDelete: 'CASCADE'
      });
    };
  
    return Follower;
  };