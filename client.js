#!/usr/bin/env node
var program = require('commander');
var Client  = require('node-rest-client').Client;
var client = new Client();

const API_HOST = 'http://localhost:8000/api';

program.version('0.0.1');

program
  .command('pull')
  .description('download files form the server')
  .action(function(env, options) {
    console.log('pulling...');
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
