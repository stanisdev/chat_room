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
      expired: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  UserKey.associate = function(models) {};

  UserKey.findOneByParams = function(params) {
    return UserKey.findOne({
      where: params,
      limit: 1,
      raw: true,
    });
  };

  UserKey.removeOneByParams = function(params) {
    return UserKey.destroy({
      where: params,
      limit: 1,
    });
  };

  return UserKey;
};
