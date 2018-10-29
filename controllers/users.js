class Users {
  login(req, res, next) {
    res.json({});
  }

  async register(req, res, next) {
    // @TODO: add "expiration" flag to "user.key"
    const { key } = await this.db.User.createNew(req.body);
    try {
      await this.services.mailer.send({
        email: req.body.email,
        type: 'USER_REGISTRATION',
        data: {
          key,
          serverUrl: this.config.SERVER_URL,
        },
      });
    } catch (err) {
      // @TODO: Create email resubmission mechanism
      return next(new Error('Email has not been sent'));
    }
    res.json({});
  }
}

module.exports = Users;
