'use strict';
module.exports = (sequelize, DataTypes) => {
  const MessageStatus = sequelize.define('MessageStatus', {
    message_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: DataTypes.TINYINT
  }, {});
  MessageStatus.associate = function(models) {
    // associations can be defined here
  };
  return MessageStatus;
};