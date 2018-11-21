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
    Message.belongsTo(models.User, { as: 'user' });
  };

  Message.createNew = function(params) {
    const { userId, chatId, content, type } = params;
    return new Promise((resolve, reject) => {
      models.ChatMember.findAllByParams({
        chat_id: chatId,
      })
        .then(members => {
          return sequelize
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
              resolve({
                message: _message.get({
                  plain: true,
                }),
                members,
              });
            })
            .catch(reject);
        })
        .catch(reject);
    });
  };

  Message.findAllByChat = async function(params) {
    const { userId, chatId, limit, offset } = params;
    const messageStatuses = await models.MessageStatus.findAll({
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
              as: 'user',
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
      limit,
      offset,
    });
    return messageStatuses.map(messageStatus => {
      const message = messageStatus.Message.get({
        plain: true,
      });
      message.status = messageStatus.status;
      return message;
    });
  };

  return Message;
};
