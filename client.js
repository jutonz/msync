var Client = require('node-rest-client').Client;

var client = new Client();

client.registerMethod('getFiles', 'http://localhost:8000/api/files', 'GET');

client.methods.getFiles(function(data, response) {
  console.log(data.toString('utf8'));
});
