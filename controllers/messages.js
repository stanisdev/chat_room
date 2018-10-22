class Messages {

  async getAll(req, res, next) {
    res.json([
      {
        id: 1,
        content: 'Message #1'
      },
    ]);
  }
  async create(req, res, next) {
    const {content, type} = req.body;
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