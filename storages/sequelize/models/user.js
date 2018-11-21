const bcrypt = require('bcrypt');
const randomString = require('randomstring');
const config = require(process.env.CONFIG_PATH);

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
        deafultValue: 0, // 0 - not activated, 1 - activated
      },
      blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        deafultValue: false,
      },
      last_login: {
        type: DataTypes.DATE,
      },
    },
    {}
  );

  /**
   * To associate User model with other models
   *
   * @param {Object} models
   */
  User.associate = function(models) {
    User.belongsToMany(models.Chat, {
      through: models.ChatMember,
      as: 'Chats',
    });
    User.hasMany(models.Message);
    User.hasMany(models.ChatMember);
  };

  /**
   * Find one user by filter parameters
   *
   * @async
   * @param {Object} params
   * @param {Array} attributes=[]
   * @return {Promise<Object>}
   */
  User.findOneByParams = function(params, attributes = []) {
    attributes = ['id', 'name', 'email', 'status', 'blocked'].concat(
      attributes
    );
    return User.findOne({
      where: params,
      attributes,
      limit: 1,
      raw: true,
    });
  };

  /**
   * To count amount of user by filter parameters
   *
   * @async
   * @param {Object} params
   * @return {Promise<Number>}
   */
  User.countByParams = function(params) {
    return User.count({
      where: params,
    });
  };

  /**
   * Creating new user
   *
   * @async
   * @param {Object} params
   * @return {Promise<Object>}
   */
  User.createNew = async function(params) {
    const { email, name, password } = params;
    const salt = randomString.generate(8);
    const hash = await bcrypt.hash(password + salt, 10);

    return new Promise((resolve, reject) => {
      const expired =
        new Date().getTime() + config.USER_EMAIL_CONFIRMATION_KEY.EXPIRATION;
      const key = randomString.generate(
        config.USER_EMAIL_CONFIRMATION_KEY.LENGTH
      );
      return sequelize
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
                expired,
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

  /**
   * Confirm user's email
   *
   * @async
   * @param {Object} params
   * @return {Promise}
   */
  User.confirmEmail = function(params) {
    const { keyId, userId } = params;
    return sequelize.transaction(function(t) {
      return User.update(
        {
          status: 1,
        },
        {
          where: { id: userId },
          limit: 1,
          transaction: t,
        }
      ).then(user => {
        return models.UserKey.destroy({
          where: { id: keyId },
          limit: 1,
          transaction: t,
        });
      });
    });
  };

  /**
   * Checking password correctness within bcrypt
   *
   * @async
   * @param {Object} params
   * @return {Promise<Boolean>}
   */
  User.checkPassword = function(params) {
    const { password, hash, salt } = params;
    return bcrypt.compare(password + salt, hash);
  };

  /**
   * To log time when user logged in
   *
   * @async
   * @param {Object} params
   * @return {Promise<Object>}
   */
  User.updateLastLogin = function(userId) {
    return User.update(
      {
        last_login: new Date(),
      },
      {
        where: { id: userId },
        limit: 1,
      }
    );
  };

  return User;
};
