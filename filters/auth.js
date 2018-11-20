const status = require('http-status');
const config = require(process.env.CONFIG_PATH);
const { jwt } = require(config.SERVICES_PATH);
const db = require(config.STORAGES_PATH).getConnection();
const fail = res => {
  res.status(status.UNAUTHORIZED).json({});
};

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (typeof header !== 'string') {
    return fail(res);
  }
  const [bearer, token] = header.split(' ');
  if (bearer !== 'Bearer' || typeof token !== 'string' || token.length < 1) {
    return fail(res);
  }
  let user;
  try {
    const { id, personalKey } = await jwt.verify(token);
    user = await db.User.findOneByParams({
      id,
      personal_key: personalKey,
      status: 1,
      blocked: false,
    });
    if (!(user instanceof Object)) {
      throw new Error('Wrong token or user not found');
    }
  } catch (err) {
    return fail(res);
  }
  req.user = user;
  next();
};
