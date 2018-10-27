class Chats {
  async getAll(req, res, next) {
    const limiter = this.services.limiter(req);
    const params = {
      userId: req.user.id,
      ...limiter,
    };
    const chats = await this.db.Chat.getManyByUser(params);
    res.json(chats);
  }

  async create(req, res, next) {
    const { type, members } = req.body;
    const userId = req.user.id;
    if (type === 0) {
      const check = await this.db.Chat.checkDialogExistence(userId, ...members);
      if (check instanceof Object && check.exists === true) {
        const chat = await this.db.Chat.findByParams({
          id: check.chatId,
        });
        return res.json(chat);
      }
    }
    members.push(userId);
    const chat = await this.db.Chat.createNew({ type, members });
    res.json(chat);
  }
}

module.exports = Chats;
