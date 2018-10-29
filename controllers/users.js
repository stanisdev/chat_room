class Users { 
  login(req, res, next) {
    res.json({});
  }

  async register(req, res, next) {
    await this.db.User.createNew(req.body);
    res.json({});
  }
}

module.exports = Users;