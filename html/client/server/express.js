'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var compression = require('compression');
var config = require(__base + 'server/env/config');

/**
 * Express configuration
 */
module.exports = function(app) {
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  if ('production' === config.env) {
  	app.get('*',function(req, res, next){
  	  if(req.headers['x-forwarded-proto']!='https')
  	    res.redirect('https://' + req.get('Host') + req.url)
  	  else
  	    next() /* Continue to other routes if we're not redirecting */
  	});
  	app.use(compression());
  }
  app.use(favicon(path.join(config.root, 'app', 'favicon.ico')));
  app.use('/', express.static(path.join(config.root, 'app')));
  app.set('views', config.root + '/app/views');
};
