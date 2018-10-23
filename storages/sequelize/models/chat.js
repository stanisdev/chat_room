module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    'Chat',
    {
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
    },
    {}
  );

  Chat.associate = function(models) {
    Chat.belongsToMany(models.User, {
      through: models.ChatMember,
      as: 'Members',
    });
  };

  Chat.createNew = function(params) {
    const { models } = sequelize;
    let { members, type } = params;
    let _chat;
    return new Promise((resolve, reject) => {
      sequelize
        .transaction(function(t) {
          return Chat.create(
            {
              type,
              members_count: members.count,
            },
            { transaction: t }
          ).then(function(chat) {
            _chat = chat;
            members = members.map(id => {
              return {
                user_id: id,
                chat_id: chat.get('id'),
              };
            });
            return models.ChatMember.bulkCreate(members, { transaction: t });
          });
        })
        .then(() => {
          resolve(
            _chat.get({
              plain: true,
            })
          );
        })
        .catch(reject);
    });
  };

  Chat.checkDialogExistence = async function(userId, interlocutorId) {
    const query = `
      SELECT count(ch.id) count, ch.id chat_id FROM Chats ch 
      LEFT JOIN ChatMembers chm ON ch.id = chm.chat_id
      WHERE ch.type = 0 AND (chm.user_id = ? OR chm.user_id = ?)
      GROUP BY ch.id
      HAVING count > 1
    `;
    const [result] = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: [userId, interlocutorId],
    });
    const exists = result instanceof Object && result.count === 2;
    return {
      exists,
      chatId: exists ? result.chat_id : null,
    };
  };

  Chat.findByParams = async function(params) {
    const chat = await Chat.findOne({
      where: params,
    });
    return chat.get({
      plain: true,
    });
  };

  return Chat;
};
