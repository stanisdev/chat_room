module.exports = (sequelize, DataTypes) => {
  const UserKey = sequelize.define('UserKey', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {});

  UserKey.associate = function(models) {};

  return UserKey;
};