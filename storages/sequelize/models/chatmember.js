module.exports = (sequelize, DataTypes) => {
  const ChatMember = sequelize.define('ChatMember', {
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
  }, {
    timestamps: false,
  });

  ChatMember.associate = function(models) {
  };

  return ChatMember;
};