'use strict';

global.__base = __dirname + '/';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('express');
var http = require('http');
var config = require('./server/env/config');
var app = express();
require(__base + 'server/express')(app);
require(__base + 'server/routes')(app);
console.log('Starting up on %s:%d, in %s mode',
    config.ip, config.port, process.env.NODE_ENV);
http.createServer(app).listen(config.port, config.ip, function () {
  console.log('HTTP server listening on %s:%d, in %s mode',
    config.ip, config.port, process.env.NODE_ENV);
});
exports = module.exports = app;