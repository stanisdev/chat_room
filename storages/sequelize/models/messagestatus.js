module.exports = (sequelize, DataTypes) => {
  const MessageStatus = sequelize.define('MessageStatus', {
    message_id: {
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
  }, {
    timestamps: false,
  });

  MessageStatus.associate = function(models) {
  };

  return MessageStatus;
};
