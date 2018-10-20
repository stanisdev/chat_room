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
    res.json([{
      message: 'Created',
    }]);
  }
}

module.exports = Chats;