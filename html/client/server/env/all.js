'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 9000,
  ip: process.env.IP || '127.0.0.1'
};
