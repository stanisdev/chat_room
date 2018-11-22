const status = require('http-status');

/**
 * This is the class to provide chats
 */
class Chats {
  /**
   * Get list of chats of user
   *
   * Optional Query params:
   *  limit<Number>,
   *  offset<Number>
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getAll(req, res, next) {
    const limiter = this.services.limiter(req);
    const params = {
      userId: req.user.id,
      ...limiter,
    };
    const chats = await this.db.Chat.getManyByUser(params);
    res.json(chats);
  }

  /**
   * Creating new Chat
   *
   * Expected POST fields:
   *  type<Number>,
   *  members<Array[Number]>
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async create(req, res, next) {
    const { type, members } = req.body;
    const userId = req.user.id;
    if (type === 0) {
      const check = await this.db.Chat.checkDialogExistence(userId, ...members);
      if (check instanceof Object && check.exists === true) {
        return res.json(check.chat);
      }
    }
    const usersCount = await this.db.User.countByParams({
      id: members,
    });
    if (usersCount !== members.length) {
      // One of the transferred users does not exist
      return res.status(status.BAD_REQUEST).json({});
    }
    const chat = await this.db.Chat.createNew({ type, members, userId });
    res.json(chat);
  }

  /**
   * Add user to chat
   *
   * Expected URL params:
   *  chat_id<Number>,
   *  user_id<Number>
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addMember(req, res, next) {
    const params = {
      chatId: req.params.chat_id,
      userId: req.params.user_id,
    };
    await this.db.Chat.addMember(params);
    res.json({});
  }
}

module.exports = Chats;
