const Joi = require('joi');
const only = require('only');

module.exports = {
  async create(req, res, next) {
    const data = only(req.body, 'type members');
    
    const schema = Joi.object().keys({
      type: Joi.number().integer().min(0).max(1).required(),
      members: Joi.array().items(Joi.number().integer().min(1)).required(),
    });
    const result = Joi.validate(data, schema);
    if (result.error !== null) {
      return this.fail(res);
    }
    const chatType = +req.body.type;
    let members = req.body.members.filter((member) => req.user.id !== +member); // Remove user's id
    members = [...new Set(members)]; // Unique values

    const wrong = {
      dialog: chatType === 0 && members.length !== 1,
      groupChat: chatType === 1 && members.length < 1,
    };
    if (wrong.dialog || wrong.groupChat) {
      return this.fail(res);
    }
    const count = await this.db.User.countByParams({ // Used wrong user id
      id: members,
    });
    if (count !== members.length) {
      return this.fail(res);
    }
    next();
  },

  id(req, res, next) {
    const schema = Joi.object().keys({
      chat_id: Joi.number().integer().min(1).required(),
    });
    const data = only(req.params, 'chat_id');
    const result = Joi.validate(data, schema);
    if (result.error !== null) {
      return this.fail(res);
    }
    next();
  }
};