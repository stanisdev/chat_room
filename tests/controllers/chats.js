const { chai, server, expect } = require('../server');

describe('Users controller', function() {
  describe('/users/login endpoint', function() {
    it('Should be forbidden to log in because not passed email/password', function(done) {
      chai
        .request(server)
        .post('/users/login')
        .end(function(err, res) {
          expect(res.status).to.be.equal(400);
          done();
        });
    });
  });
});
