'use strict';
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
      type: DataTypes.TINYINT,
      defaultValue: 0, // 0 - common member, 1 - administrator
      allowNull: false,
    },
  }, {
    timestamps: false,
  });

  ChatMember.associate = function(models) {
    // associations can be defined here
  };

  return ChatMember;
};