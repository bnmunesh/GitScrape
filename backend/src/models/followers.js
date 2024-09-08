
module.exports = (sequelize, DataTypes, User) => {
    const Follower = sequelize.define('Follower',
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                primarykey: true,
                references: {
                    model: User,
                    key: 'username'
                },
                foreignKey: true
            },
            username2: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isFriend:{
                type:DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            paranoid: false,
            timestamps: false
        }

    );
    return Follower;
}