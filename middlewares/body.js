const trimBody = require('trim-body');

module.exports = (req, res, next) => {
  const method = req.method.toLowerCase();
  if (['post', 'put'].includes(method)) {
    trimBody(req.body);
  }
  next();
};
