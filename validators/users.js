const Joi = require('joi');
const only = require('only');

module.exports = {
  id(req, res, next) {
    const schema = Joi.object().keys({
      user_id: Joi.number()
        .integer()
        .min(1)
        .required(),
    });
    const data = only(req.params, 'user_id');
    const result = Joi.validate(data, schema);
    if (result.error !== null) {
      return this.fail(res);
    }
    next();
  },

  register(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email().max(60).required(),
      name: Joi.string().max(60).required(),
      password: Joi.string().required(),
    });
    const result = Joi.validate(req.body, schema);
    if (result.error !== null) {
      return this.fail(res);
    }
    next();
  }
};
