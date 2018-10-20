const Joi = require('joi');
const only = require('only');
const status = require('http-status');
const config = require(process.env.CONFIG_PATH);
const db = require(config.STORAGES_PATH).getConnection();
const fail = (res) => {
  res.status(status.BAD_REQUEST).json({});
};

module.exports = {
  async create(req, res, next) {
    const data = only(req.body, 'type members');
    
    const schema = Joi.object().keys({
      type: Joi.number().integer().min(0).max(1).required(),
      members: Joi.array().items(Joi.number().integer().min(1)).required(),
    });
    const result = Joi.validate(data, schema);
    if (result.error !== null) {
      return fail(res);
    }
    const chatType = +req.body.type;
    let members = req.body.members.filter((member) => req.user.id !== +member); // Remove user's id
    members = [...new Set(members)]; // Unique values

    const wrong = {
      dialog: chatType === 0 && members.length !== 1,
      groupChat: chatType === 1 && members.length < 1,
    };
    if (wrong.dialog || wrong.groupChat) {
      return fail(res);
    }
    const count = await db.User.countByParams({ id: members }); // Used wrong user id
    if (count !== members.length) {
      return fail(res);
    }
    next();
  }
};