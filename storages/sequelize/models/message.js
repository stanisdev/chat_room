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

  Message.associate = function(models) {};

  Message.createNew = function(params) {
    const { userId, chatId, content, type } = params;
    return new Promise((resolve, reject) => {
      models.ChatMember.findAllByParams({
        chat_id: params.chatId,
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

  Message.findAllByChat = function(params) {
    return [{ 1: 1 }];
  };

  return Message;
};
