class Users {
  login(req, res, next) {
    res.json({});
  }

  async register(req, res, next) {
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

  async confirmEmail(req, res, next) {
    const params = {
      keyId: req.userKey.id,
      userId: req.userKey.user_id,
    };
    await this.db.User.confirmEmail(params);
    res.json({});
  }
}

module.exports = Users;
