module.exports = (sequelize, DataTypes) => {
  const { models, Op } = sequelize;
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
    Chat.hasMany(models.ChatMember);
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

  Chat.getManyByUser = async function(params) {
    const { userId, limit, offset } = params;
    const memberships = await models.ChatMember.findAll({
      // Find users's chats
      where: {
        user_id: userId,
      },
      include: [
        {
          model: models.Chat,
          attributes: ['id', 'name', 'image', 'members_count', 'type'],
        },
      ],
      limit,
      offset,
    });
    const query = `
    SELECT m.id, m.chat_id, m.content, m.type, m.created_at, 
      ms.\`status\`, u.\`name\` \`user.name\`, u.id \`user.id\`
    FROM MessageStatuses ms 
    INNER JOIN Messages m ON ms.message_id = m.id
    INNER JOIN Users u ON m.user_id = u.id
    WHERE ms.id IN (
      SELECT MAX(id) as id 
      FROM MessageStatuses 
      WHERE user_id = ? AND chat_id IN (?)
      GROUP BY chat_id
    )`;
    const chatIds = memberships.map(membership => membership.get('chat_id'));
    const tasks = [];

    tasks.push(
      sequelize.query(query, {
        // Last messages
        type: sequelize.QueryTypes.SELECT,
        replacements: [userId, chatIds],
      })
    );
    tasks.push(
      models.MessageStatus.findAll({
        // Unread messages
        where: {
          chat_id: chatIds,
          user_id: userId,
          status: {
            [Op.lt]: 2,
          },
        },
        group: ['chat_id'],
        attributes: [
          'chat_id',
          [sequelize.fn('COUNT', 'chat_id'), 'totalCount'],
        ],
        raw: true,
      })
    );

    const [lastMessages, unreadMessages] = await Promise.all(tasks);
    const chats = memberships.map(membership => {
      const chat = membership.Chat.get({
        plain: true,
      });
      chat.membership = {
        role: membership.get('role'),
      };
      let lastMessage = lastMessages.find(
        message => message.chat_id === chat.id
      );
      if (lastMessage instanceof Object) {
        const user = {};
        Object.keys(lastMessage).forEach(key => {
          if (key.startsWith('user.')) {
            const value = lastMessage[key];
            delete lastMessage[key];
            user[key.substr(5)] = value;
          }
        });
        lastMessage.user = user;
      } else {
        lastMessage = {};
      }
      chat.last_message = lastMessage;
      const _unreadMessages = unreadMessages.find(
        element => element.chat_id === chat.id
      );
      chat.unread_messages =
        _unreadMessages instanceof Object ? _unreadMessages.totalCount : 0;
      return chat;
    });
    return chats;
  };

  Chat.addMember = async function(params) {
    // @TODO: Create system message "User added to chat"
    const { chatId, userId } = params;
    sequelize.transaction(function(t) {
      return models.ChatMember.create(
        {
          user_id: userId,
          chat_id: chatId,
          role: 0,
        },
        { transaction: t }
      ).then(function() {
        return Chat.update(
          {
            members_count: sequelize.literal('members_count + 1'),
          },
          {
            where: { id: chatId },
            limit: 1,
            transaction: t,
          }
        );
      });
    });
    return true;
  };

  return Chat;
};
