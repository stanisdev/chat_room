class Chats {

  async getAll(req, res, next) {
    res.json([
      {
        id: 1,
        name: 'Chat #1',
      },
    ]);
  }
}

module.exports = Chats;