class Messages {
  async getAll(req, res, next) {
    const { limit, offset } = this.services.limiter(req);
    const params = {
      userId: req.user.id,
      chatId: req.params.chat_id,
      limit,
      offset,
    };
    const messages = await this.db.Message.findAllByChat(params);
    res.json(messages);
  }
  async create(req, res, next) {
    const { content, type } = req.body;
    const message = await this.db.Message.createNew({
      userId: req.user.id,
      chatId: req.params.chat_id,
      content,
      type,
    });
    res.json(message);
  }
}

module.exports = Messages;
