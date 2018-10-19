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
    Chat.membersAssociation = Chat.belongsToMany(models.User, {
      through: models.ChatMember,
      as: 'Members',
    });
  };
  
  Chat.getMembers = async function(chatId) {
    const chat = await Chat.findOne({
      include:[
        Chat.membersAssociation,
      ],
      where: {
        id: chatId,
      }
    });
    const members = [];
    chat.Members.forEach((member) => {
      members.push(
        member.get({plain: true})
      );
    });
    return members;
  };

  return Chat;
};