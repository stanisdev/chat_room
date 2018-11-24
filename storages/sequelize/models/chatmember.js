module.exports = (sequelize, DataTypes) => {
  const ChatMember = sequelize.define(
    'ChatMember',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.TINYINT, // 0 - common member, 1 - administrator
      },
    },
    {
      timestamps: false,
    }
  );

  /**
   * To associate ChatMember model with other models
   *
   * @param {Object} models
   */
  ChatMember.associate = function(models) {
    ChatMember.belongsTo(models.Chat);
    ChatMember.belongsTo(models.User);
  };

  /**
   * Find one member of chat by filter parameters
   *
   * @async
   * @param {Object} params
   * @return {Promise<Object>}
   */
  ChatMember.findOneByParams = function(params) {
    return ChatMember.findOne({
      where: params,
      limit: 1,
      raw: true,
    });
  };

  /**
   * Find all members of chat by filter parameters
   *
   * @async
   * @param {Object} params
   * @return {Promise<Object>}
   */
  ChatMember.findAllByParams = function(params) {
    return ChatMember.findAll({
      where: params,
      raw: true,
    });
  };

  return ChatMember;
};
