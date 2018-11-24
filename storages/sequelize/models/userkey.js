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

  /**
   * To associate UserKey model with other models
   *
   * @param {Object} models
   */
  UserKey.associate = function(models) {};

  /**
   * Find one key of user by filter parameters
   *
   * @async
   * @param {Object} params
   * @return {Promise<Object>}
   */
  UserKey.findOneByParams = function(params) {
    return UserKey.findOne({
      where: params,
      limit: 1,
      raw: true,
    });
  };

  /**
   * Remove one key of user by filter parameters
   *
   * @async
   * @param {Object} params
   * @return {Promise}
   */
  UserKey.removeOneByParams = function(params) {
    return UserKey.destroy({
      where: params,
      limit: 1,
    });
  };

  return UserKey;
};
