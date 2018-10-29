const bcrypt = require('bcrypt');
const randomString = require('randomstring');

module.exports = (sequelize, DataTypes) => {
  const { models } = sequelize;
  const User = sequelize.define(
    'User',
    {
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
    },
    {}
  );

  User.associate = function(models) {
    User.belongsToMany(models.Chat, {
      through: models.ChatMember,
      as: 'Chats',
    });
    User.hasMany(models.Message);
  };

  User.findOneByParams = function(params) {
    return User.findOne({
      where: params,
      attributes: ['id', 'name', 'email', 'status', 'blocked'],
      limit: 1,
      raw: true,
    });
  };

  User.countByParams = function(params) {
    return User.count({
      where: params,
    });
  };

  User.createNew = async function(params) {
    const { email, name, password } = params;
    const salt = randomString.generate(8);
    const hash = await bcrypt.hash(password + salt, 10);

    return new Promise((resolve, reject) => {
      const key = randomString.generate(25);
      sequelize
        .transaction(function(t) {
          return User.create(
            {
              name,
              email,
              password: hash,
              salt,
              status: 0,
              blocked: false,
              personal_key: randomString.generate(7),
            },
            { transaction: t }
          ).then(user => {
            return models.UserKey.create(
              {
                user_id: user.get('id'),
                key,
              },
              { transaction: t }
            );
          });
        })
        .then(() => {
          resolve({ key });
        })
        .catch(reject);
    });
  };

  return User;
};
