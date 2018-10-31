const status = require('http-status');

module.exports = {
  async doesExist(req, res, next) {
    const user = await this.db.User.findOneByParams({
      id: req.params.user_id,
    });
    if (!(user instanceof Object)) {
      return this.fail(res);
    }
    req.foundUser = user;
    next();
  },

  isActive(req, res, next) {
    const { foundUser } = req;
    if (foundUser.blocked || foundUser.status < 1) {
      return this.fail(res);
    }
    next();
  },

  async doesEmailExist(req, res, next) {
    const { email } = req.body;
    const user = await this.db.User.findOneByParams({ email });
    if (user instanceof Object) {
      return res.json({
        codes: [this.codes.EMAIL_REGISTERED],
      });
    }
    next();
  },

  async confirmEmailKeyExpired(req, res, next) {
    const { key } = req.params;
    const record = await this.db.UserKey.findOneByParams({ key });
    const fail = () => {
      res.status(status.GONE).json({});
    };
    if (!(record instanceof Object)) {
      // Not found
      return fail();
    }
    if (new Date(record.expired) <= Date.now()) {
      // Expired
      await this.db.UserKey.removeOneByParams({
        id: record.id,
      });
      return fail();
    }
    req.userKey = record;
    next();
  },
};
