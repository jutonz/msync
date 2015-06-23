var request = require('supertest');
var tmp     = require('tmp');
var fs      = require('fs');

function binaryParser(response, callback) {
  response.setEncoding('binary');
  response.data = '';
  response.on('data', function(chunk) {
    console.log('Adding data:', chunk);
    res.data += chunk;
  });
  response.on('end', function() {
    callback(null, new Buffer(response.data, 'binary'));
  });
}

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

  it('uploads and downloads files', function(done) {
    var temp = tmp.fileSync();
    request(server)
      .post('/api/files')
      .attach('tempfile', temp.name)
      .expect(201)

    request(server)
      .get('/api/files')
      .end(function(err, res) {
        if (err) return done(err);
        console.log('res=', res);

        fs.open('/home/justin/Desktop/test.file', 'w', function(err, fd) {
          fs.write(fd, res.body, res.body.length, null, function(err) {
            fs.close(fd, function() { console.log('file written'); });
          });
        });
        done();
      })
  });
});
