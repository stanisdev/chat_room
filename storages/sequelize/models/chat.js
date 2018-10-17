module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(150),
    },
    members_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0, // 0 - common chat, 1 - group chat
    },
  }, {});

  Chat.associate = function(models) {
    // associations can be defined here
  };
  
  return Chat;
};