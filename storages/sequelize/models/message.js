module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.TINYINT,
      defaultValue: 0, // 0 - text/plain
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    edited: {
      type: DataTypes.BOOLEAN,
    },
    quote_for: {
      type: DataTypes.INTEGER,
    },
  }, {});

  Message.associate = function(models) {
  };

  return Message;
};