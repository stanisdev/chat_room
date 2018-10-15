class Messages {

  async getAll(req, res, next) {
    res.json([
      {
        id: 1,
        content: 'Message #1'
      },
    ]);
  }
}

module.exports = Messages;