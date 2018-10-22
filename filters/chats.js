const status = require('http-status');

module.exports = {
  async isChatMember(req, res, next) {
    const membership = await this.db.ChatMember.findOneByParams({
      user_id: req.user.id,
      chat_id: req.params.chat_id,
    });
    if (!membership) {
      return res.status(status.FORBIDDEN).json({});
    }
    next();
  }
};