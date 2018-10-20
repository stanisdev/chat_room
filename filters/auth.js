const status = require('http-status');
const config = require(process.env.CONFIG_PATH);
const {jwt, wrapper} = require(config.SERVICES_PATH);
const db = require(config.STORAGES_PATH).getConnection();
const fail = (res) => {
  res.status(status.UNAUTHORIZED).json({});
};

module.exports = wrapper(async(req, res, next) => {
  let header = req.headers.authorization;
  if (typeof header !== 'string') {
    return fail(res);
  }
  const [bearer, token] = header.split(' ');
  if (bearer !== 'Bearer' || typeof token !== 'string' || token.length < 1) {
    return fail(res);
  }
  let userData;
  try {
    userData = await jwt.verify(token);
  } catch (err) {
    return fail(res);
  }
  const {id, personal_key} = userData;
  const user = await db.User.findOneByParams({ 
    id, 
    personal_key, 
  });
  if (!(user instanceof Object)) {
    return fail(res);
  }
  req.user = user;
  next();
});