/**
 * This is the class to provide users actions
 */
class Users {
  /**
   * Log in to system
   *
   * Expected POST fields:
   *  email<String>,
   *  password<String>
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async login(req, res, next) {
    const { email, password } = req.body;
    const { codes } = this;
    const fail = code => {
      res.json({
        codes: [code],
      });
    };
    const attributes = ['password', 'salt', 'personal_key'];
    const user = await this.db.User.findOneByParams({ email }, attributes);
    if (!(user instanceof Object)) {
      return fail(codes.WRONG_EMAIL_OR_PASSWORD);
    }
    if (user.status < 1) {
      return fail(codes.EMAIL_NOT_CONFIRMED);
    } else if (Boolean(user.blocked)) {
      return fail(codes.USER_WAS_BLOCKED);
    }
    const params = {
      password,
      hash: user.password,
      salt: user.salt,
    };
    const isValid = await this.db.User.checkPassword(params);
    if (!isValid) {
      return fail(codes.WRONG_EMAIL_OR_PASSWORD);
    }
    await this.db.User.updateLastLogin(user.id);
    const token = await this.services.jwt.sign({
      id: user.id,
      personalKey: user.personal_key,
    });
    res.json({ token });
  }

  /**
   * Register new user
   *
   * Expected POST fields:
   *  email<String>,
   *  password<String>,
   *  name<String>
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
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

  /**
   * Confirm user's profile with key transmitted by email
   *
   * Expected URL params:
   *  key<String>
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async confirmEmail(req, res, next) {
    const params = {
      keyId: req.userKey.id,
      userId: req.userKey.user_id,
    };
    await this.db.User.confirmEmail(params);
    res.json({});
  }

  /**
   * Get user's prifile data
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async profile(req, res, next) {
    const { id } = req.user;
    const attributes = ['name', 'email'];
    const user = await this.db.User.findOneByParams({ id }, attributes);
    res.json(user);
  }
}

module.exports = Users;
