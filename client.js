#!/usr/bin/env node
var fs      = require('fs');
var program = require('commander');
var Client  = require('node-rest-client').Client;
var client  = new Client();

const API_HOST = 'http://localhost:8000/api';

program.version('0.0.1');

function listFiles(done) {
  client.get(API_HOST + '/files', function(data, response) {
    var files = JSON.parse(data).array;
    done(files);
  });
};
 

function downloadFiles(files, done) {
  files.forEach(function(file) {
    console.log('Starting download for file:', file);
    downloadFile(file);
  });
};

function downloadFile(file, done) {
  if (file === undefined) { return done(); }
  else {
    client.get(API_HOST + '/files/' + file, function(data, response) {
      fs.writeFileSync(file, data);
      console.log('Downloaded file:', file);
      if (done) { done(); }
    });
  }
};

program
  .command('pull')
  .description('download files form the server')
  .action(function(env, options) {
    console.log('pulling...');
    listFiles(downloadFiles);
  });

program
  .command('push')
  .description('upload files to the server')
  .action(function(env, options) {
    console.log('pushing...');
  });

program
  .command('list')
  .description('list files on the server')
  .action(function(env, options) {
    var args = {};
    client.get(API_HOST + '/files', args, function(data, response) {
      var files = JSON.parse(data).array;
      files.forEach(function(file) {
        console.log(file);
      });
    });
  });

program.parse(process.argv);
