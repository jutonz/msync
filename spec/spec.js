var request = require('supertest');

describe('loading express', function() {
  var server;
  beforeEach(function() {
    server = require('./../server');
  });

  afterEach(function() {
    server.close();
  });

  it('responds to /api/', function(done) {
    request(server)
      .get('/api/')
      .expect(200, done);
  });
});
