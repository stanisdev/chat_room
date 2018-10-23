const Joi = require('joi');

module.exports = {
  create(req, res, next) {
    const schema = Joi.object().keys({
      type: Joi.number().integer().min(0).required(),
      content: Joi.string().required(),
    });
    if (Joi.validate(req.body, schema).error !== null) {
      return this.fail(res);
    }
    next();
  },
};
