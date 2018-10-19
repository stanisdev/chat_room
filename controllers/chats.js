const config = require(process.env.CONFIG_PATH);
const db = require(config.SEQUELIZE_PATH);

class Chats {

  async getAll(req, res, next) {
    const members = await db.Chat.getMembers(1);
    console.log(members);
    res.json([
      {
        id: 1,
        name: 'Chat #1',
      },
    ]);
  }
}

module.exports = Chats;