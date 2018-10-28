const status = require('http-status');

module.exports = {
  async isMember(req, res, next) {
    const membership = await this.db.ChatMember.findOneByParams({
      user_id: req.user.id,
      chat_id: req.params.chat_id,
    });
    if (!membership) {
      return res.status(status.FORBIDDEN).json({});
    }
    next();
  },

  async canAddMember(req, res, next) {
    const currentUserId = req.user.id;
    const newMemberId = +req.params.user_id;
    const chatId = req.params.chat_id;
    const members = await this.db.ChatMember.findAll({
      where: {
        chat_id: chatId,
        user_id: {
          [this.db.sequelize.Op.or]: [currentUserId, newMemberId],
        },
      },
      include: [
        {
          model: this.db.Chat,
          attributes: ['type'],
        },
      ],
      raw: true,
    });
    if (!Array.isArray(members) || members.length < 1) {
      // Chat does not exist
      return this.fail(res);
    }
    const chatType = members[0]['Chat.type'];
    const currentUserMembership = members.find(
      member => member.user_id === currentUserId
    );
    const role =
      currentUserMembership instanceof Object
        ? currentUserMembership.role
        : null;

    const prohibited =
      // If chat type is not a group
      chatType !== 1 ||
      // If current user has no rights or even is not a member of chat
      role !== 1 ||
      // If being added user is already member of chat
      members.find(member => member.user_id === newMemberId);
    if (prohibited) {
      return this.fail(res);
    }
    next();
  },
};
