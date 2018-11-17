const { chai, server, expect, storage } = require('../server');
let db, app, token;

describe('Users controller', function() {
  before(async () => {
    app = await server;
    await storage.authenticate();
    db = storage.getConnection();
  });

  describe('/users/login endpoint', function() {
    it('Should be forbidden to log in because not passed email/password', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('form')
        .end(async function(err, res) {
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
          email: 'wrong@email.com',
          password: 'secret',
        })
        .end(async function(err, res) {
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
        .end(async function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.codes).to.be.eql([1]);
          done();
        });
    });
    it('Should log in with correct email/password', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('form')
        .send({
          email: 'mary@gmail.com',
          password: 'nice_password',
        })
        .end(async function(err, res) {
          expect(res.status).to.be.equal(200);
          expect(res.body.token).to.be.a('string');
          token = res.body.token;
          done();
        });
    });
  });
});
