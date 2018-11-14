/**
 * This is the class to provide messages of chats
 */
class Messages {
  /**
   * Get list of messages by chat_id
   *
   * Optional Query params:
   *  limit<Number>,
   *  offset<Number>
   *
   * Expected URL params:
   *  chat_id<Number>
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
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

  /**
   * Create new message related to chat_id
   *
   * Expected URL params:
   *  chat_id<Number>
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
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
