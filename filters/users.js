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
};
