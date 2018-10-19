module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    chat_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    type: {
      type: Sequelize.TINYINT,
      defaultValue: 0, // 0 - text/plain
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    edited: {
      type: Sequelize.BOOLEAN,
    },
    quote_for: {
      type: Sequelize.INTEGER,
    },
  }, {});

  Message.associate = function(models) {
  };

  return Message;
};