var express    = require('express');
var bodyParser = require('body-parser');
var busboy     = require('connect-busboy');
var fs         = require('fs-extra');
var app        = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(busboy());
// app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.MSYNC_PORT || 8000;

var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'welcome to ze api' });
});

router.post('/upload', function(req, res) {
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

app.use('/api', router);

app.listen(port);
console.log('Server started on', port);
