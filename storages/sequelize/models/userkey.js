const randomString = require('randomstring');

module.exports = (sequelize, DataTypes) => {
  const UserKey = sequelize.define(
    'UserKey',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  UserKey.associate = function(models) {};

  UserKey.addUserRegistrationKey = function(userId) {
    return UserKey.create({
      user_id: userId,
      key: randomString.generate(25),
    });
  };

  return UserKey;
};
