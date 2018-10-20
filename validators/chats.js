const Joi = require('joi');
const only = require('only');
const status = require('http-status');
const fail = (res) => {
  res.status(status.BAD_REQUEST).json({});
};

module.exports = {
  create(req, res, next) {
    const data = only(req.body, 'type members');
    
    const schema = Joi.object().keys({
      type: Joi.number().integer().min(0).max(1).required(),
      members: Joi.array().items(Joi.number().integer()).required(),
    });
    const result = Joi.validate(data, schema);
    if (result.error !== null) {
      return fail(res);
    }
    next();
  }
};