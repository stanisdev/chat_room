class Chats {
  async getAll(req, res, next) {
    res.json([
      {
        id: 1,
        name: 'Chat #1',
      },
    ]);
  }

  async create(req, res, next) {
    const {type, members} = req.body;
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
    const chat = await this.db.Chat.createNew({type, members});
    res.json(chat);
  }
}

module.exports = Chats;
