var express    = require('express');
var bodyParser = require('body-parser');
var busboy     = require('connect-busboy');
var fs         = require('fs-extra');
var path       = require('path');
var app        = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboy());

var port = process.env.MSYNC_PORT || 8000;

var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'welcome to ze api' });
});

router.post('/files', function(req, res) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    console.log('Receiving file:', filename);

    fstream = fs.createWriteStream(__dirname + '/uploaded/' + filename);
    file.pipe(fstream);
    fstream.on('close', function() {
      console.log('Finished receiving file: ', filename);
      res.status(201);
      res.send('File received');
    });
  });
});

router.get('/files', function(req, res) {
  fs.readdir(__dirname + '/uploaded/', function(err, files) {
    var json = JSON.stringify({
      array: files
    });
    res.status(200);
    res.json({ array: files });
  });  
});

router.get('/files/:name', function(req, res) {
  var options = {
    root: __dirname + '/uploaded/'
  , dotfiles: 'allow'
  , headers: {
      'x-timestamp': Date.now()
    , 'x-sent': true 
    }
  };
  var filename = req.params.name;
  res.sendFile(filename, options, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log('Sent:', filename);
    }
  });
});

app.use('/api', router);

var server = app.listen(port);
console.log('Server started on', port);


module.exports = server;
