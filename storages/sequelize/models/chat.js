module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    name: {
      type: DataTypes.STRING(100),
    },
    image: {
      type: DataTypes.STRING(150),
    },
    members_count: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false,
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0, // 0 - dialog, 1 - group chat
    },
  }, {});

  Chat.associate = function(models) {
    Chat.belongsToMany(models.User, {
      through: models.ChatMember,
      as: 'Members',
    });
  };

  Chat.createNew = async function() {
    return true;
  };

  Chat.checkDialogExistence = function(userId, interlocutorId) {
  };

  return Chat;
};