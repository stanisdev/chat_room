const randomString = require('randomstring');
const { chai, server, expect, storage, config } = require('../server');
let db, app, token, emailConfirmKey, newUserId;

const mockData = {
  expiredEmailConfirmationKey: 'SeOI32WmzFRHMAhdBHRgJaE1n',
  newUser: {
    email: 'ava@gmail.com',
    password: 'strong-pswd',
    name: 'Ava',
  },
  existingUser: {
    email: 'bill@gmail.com',
  },
  notConfirmedUser: {
    email: 'robert@gmail.com',
    password: 'nice_password',
  },
  wrongUser: {
    email: 'wrong@email.com',
    password: 'secret',
  },
};

describe('Users controller', function() {
  before(async () => {
    app = await server;
    await storage.authenticate();
    db = storage.getConnection();
  });

  describe('/users/register endpoint', function() {
    it('Should be forbidden to register because no post data is transmitted', function(done) {
      chai
        .request(app)
        .post('/users/register')
        .type('form')
        .end(function(err, res) {
          expect(res.status).to.be.equal(400);
          done();
        });
    });
    it('Should be forbidden to register because such email address already registered', function(done) {
      chai
        .request(app)
        .post('/users/register')
        .type('form')
        .send({
          email: mockData.existingUser.email,
          password: mockData.newUser.password,
          name: mockData.newUser.name,
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.codes).to.be.eql([0]);
          done();
        });
    });
    it('Should register with correct post data', function(done) {
      chai
        .request(app)
        .post('/users/register')
        .type('form')
        .send({
          email: mockData.newUser.email,
          password: mockData.newUser.password,
          name: mockData.newUser.name,
        })
        .end(async function(err, res) {
          expect(res.status).to.be.equal(200);
          const user = await db.User.findOneByParams({
            email: mockData.newUser.email,
          });
          expect(user).to.be.a('object');
          expect(user.status).to.be.equal(0);
          const userKey = await db.UserKey.findOneByParams({
            user_id: user.id,
          });
          expect(userKey).to.be.a('object');
          expect(userKey.key).to.be.a('string');
          emailConfirmKey = userKey.key;
          newUserId = userKey.user_id;
          done();
        });
    });
  });

  describe('/users/confirm_email/:key endpoint', function() {
    let noExistingKey, userBefore;
    before(async () => {
      while (true) {
        const key = randomString.generate(
          config.USER_EMAIL_CONFIRMATION_KEY.LENGTH
        );
        const userKey = await db.UserKey.findOneByParams({ key });
        if (!(userKey instanceof Object)) {
          noExistingKey = key;
          break;
        }
      }
      userBefore = await db.User.findOneByParams({ id: newUserId });
    });
    it('Should be forbidden to confirm email because wrong key length', function(done) {
      chai
        .request(app)
        .get('/users/confirm_email/wrong_key_by_length')
        .end(function(err, res) {
          expect(res.status).to.be.equal(400);
          done();
        });
    });
    it('Should be forbidden to confirm email because key does not exist in DB', function(done) {
      chai
        .request(app)
        .get('/users/confirm_email/' + noExistingKey)
        .end(function(err, res) {
          expect(res.status).to.be.equal(410);
          done();
        });
    });
    it('Should be forbidden to confirm email because key does not exist in DB', function(done) {
      chai
        .request(app)
        .get('/users/confirm_email/' + mockData.expiredEmailConfirmationKey)
        .end(async function(err, res) {
          expect(res.status).to.be.equal(410);
          const userKey = await db.UserKey.findOneByParams({
            key: mockData.expiredEmailConfirmationKey,
          });
          expect(userKey).to.be.equal(null);
          done();
        });
    });
    it('Should be confirm email with correct key', function(done) {
      chai
        .request(app)
        .get('/users/confirm_email/' + emailConfirmKey)
        .end(async function(err, res) {
          expect(res.status).to.be.equal(200);
          const userAfter = await db.User.findOneByParams({ id: newUserId });
          expect(userBefore.status).to.be.equal(0);
          expect(userAfter.status).to.be.equal(1);
          const userKey = await db.UserKey.findOneByParams({
            key: emailConfirmKey,
          });
          expect(userKey).to.be.equal(null);
          done();
        });
    });
  });

  describe('/users/login endpoint', function() {
    it('Should be forbidden to log in because not passed email/password', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('form')
        .end(function(err, res) {
          expect(res.status).to.be.equal(400);
          done();
        });
    });
    it('Should be forbidden to log in because wrong email', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('form')
        .send({
          email: mockData.wrongUser.email,
          password: mockData.wrongUser.password,
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.codes).to.be.eql([1]);
          done();
        });
    });
    it('Should be forbidden to log in because wrong password', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('form')
        .send({
          email: 'mary@gmail.com',
          password: 'undefined',
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.codes).to.be.eql([1]);
          done();
        });
    });
    it('Should be forbidden to log in because email not confirmed', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('form')
        .send({
          email: mockData.notConfirmedUser.email,
          password: mockData.notConfirmedUser.password,
        })
        .end(function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.codes).to.be.eql([2]);
          done();
        });
    });
    it('Should log in new user with correct email/password', function(done) {
      const findUser = db.User.findOneByParams.bind(
        db,
        { email: mockData.newUser.email },
        ['last_login']
      );
      findUser()
        .then(userBefore => {
          chai
            .request(app)
            .post('/users/login')
            .type('form')
            .send({
              email: mockData.newUser.email,
              password: mockData.newUser.password,
            })
            .end(async function(err, res) {
              const userAfter = await findUser();
              const before = new Date(userBefore.last_login).getTime();
              const after = new Date(userAfter.last_login).getTime();

              expect(before < after).to.be.true;
              expect(res.status).to.be.equal(200);
              expect(res.body.token).to.be.a('string');
              token = res.body.token;
              done();
            });
        })
        .catch(done);
    });
  });
});
