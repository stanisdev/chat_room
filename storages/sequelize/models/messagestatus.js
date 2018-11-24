module.exports = (sequelize, DataTypes) => {
  const MessageStatus = sequelize.define(
    'MessageStatus',
    {
      message_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 0, // 0 - not delivired, 1 - delivired, 2 - has been readed
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  /**
   * To associate MessageStatus model with other models
   *
   * @param {Object} models
   */
  MessageStatus.associate = function(models) {
    MessageStatus.belongsTo(models.Message);
  };

  return MessageStatus;
};
