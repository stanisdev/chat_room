module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
    salt: {
      type: DataTypes.CHAR(8),
      allowNull: false,
    },
    personal_key: {
      type: DataTypes.CHAR(7),
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      deafult: 0, // 0 - not activated, 1 - activated
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defult: false,
    },
    last_login: {
      type: DataTypes.DATE,
    },
  }, {});

  User.associate = function(models) {
    User.belongsToMany(models.Chat, {
      through: models.ChatMember,
      as: 'Chats',
    });
  };

  User.findOneByParams = function(params) {
    return User.findOne({
      where: params,
      attributes: ['id', 'name', 'email', 'status'],
      limit: 1,
      raw: true,
    });
  };

  User.countByParams = function(params) {
    return User.count({
      where: params,
    });
  };

  return User;
};
