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
      const exists = await this.db.Chat.checkDialogExistence(userId, ...members);
      if (exists) {
        // @TODO: return existence dialog
      }
    }
    await this.db.Chat.createNew({ type, members });
    res.json([{
      message: 'Created',
    }]);
  }
}

module.exports = Chats;