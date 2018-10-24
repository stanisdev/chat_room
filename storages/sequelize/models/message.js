module.exports = (sequelize, DataTypes) => {
  const { models } = sequelize;
  const Message = sequelize.define(
    'Message',
    {
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
    },
    {}
  );

  Message.associate = function(models) {
    Message.hasMany(models.MessageStatus);
    Message.belongsTo(models.User);
  };

  Message.createNew = function(params) {
    const { userId, chatId, content, type } = params;
    return new Promise((resolve, reject) => {
      models.ChatMember.findAllByParams({
        chat_id: chatId,
      })
        .then(members => {
          sequelize
            .transaction(function(t) {
              return Message.create(
                {
                  user_id: userId,
                  chat_id: +chatId,
                  content,
                  type,
                },
                { transaction: t }
              ).then(function(message) {
                _message = message;
                statuses = members.map(member => {
                  let status = 0;
                  if (member.user_id === params.userId) {
                    status = 2;
                  }
                  return {
                    user_id: member.user_id,
                    message_id: message.get('id'),
                    chat_id: chatId,
                    status,
                  };
                });
                return models.MessageStatus.bulkCreate(statuses, {
                  transaction: t,
                });
              });
            })
            .then(() => {
              resolve(
                _message.get({
                  plain: true,
                })
              );
            })
            .catch(reject);
        })
        .catch(reject);
    });
  };

  Message.findAllByChat = async function(params) {
    const { userId, chatId, limit, offset } = params;
    const messages = await models.MessageStatus.findAll({
      where: {
        user_id: userId,
        chat_id: chatId,
      },
      attributes: ['status'],
      include: [
        {
          model: models.Message,
          attributes: ['id', 'type', 'content', 'edited', 'quote_for'],
          include: [
            {
              model: models.User,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
      limit,
      offset,
      raw: true,
    });
    return messages.map(message => {
      const user = {};
      Object.keys(message).forEach(key => {
        const value = message[key];
        if (key.startsWith('Message')) {
          delete message[key];
          key = key.substr(8);
          message[key] = value;
        }
        if (key.startsWith('User')) {
          user[key.substr(5)] = value;
          delete message[key];
        }
      });
      message.user = user;
      return message;
    });
  };

  return Message;
};
