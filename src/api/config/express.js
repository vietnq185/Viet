import fs from 'fs';
import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import winstonInstance from './winston';
import routes from '../server/routes/index.route';
import config from './config';
import APIError from '../server/helpers/APIError';
import { APIErrorResponse } from '../server/helpers/APIResponse';
import Validator from 'validator';

const debug = require('debug')('rest-api:express');

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging in dev env
if (config.env === 'development') {
  // expressWinston.requestWhitelist.push('body');
  // expressWinston.responseWhitelist.push('body');
  // app.use(expressWinston.logger({
  //   winstonInstance,
  //   meta: true, // optional: log meta data about request (defaults to true)
  //   msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
  //   colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  // }));
}

// mount all routes on /api path
app.use('/api', (req, res, next) => {
  if (typeof req.body !== 'undefined') {
    if (typeof req.body.email === 'string' && req.body.email.length > 0) {
      req.body.email = req.body.email.toLowerCase();  // eslint-disable-line
    }
    if (typeof req.body.username === 'string' && req.body.username.length > 0) {
      if (Validator.isEmail(req.body.username)) {
        req.body.username = req.body.username.toLowerCase(); // eslint-disable-line
      }
    }
  }
  return next();
}, routes);

// -------------------------------------------------------------------------------
// START - using web server on the same host with API
// -------------------------------------------------------------------------------

app.use(express.static(path.join(__dirname, '..', 'web', 'client')));
app.use(express.static(path.join(__dirname, '..', 'web', 'admin')));

// Serve Admin UI
const adminRouter = express.Router(); // eslint-disable-line new-cap
adminRouter.get('/*', (req, res, next) => {
  try {
    return res.sendFile(path.join(__dirname, '..', 'web', 'admin', 'index.html'));
  } catch (err) {
    return next(err);
  }
});
app.use('/admin', adminRouter);

// Serve Client UI
const clientRouter = express.Router(); // eslint-disable-line new-cap
clientRouter.get('/*', (req, res, next) => {
  try {
    return res.sendFile(path.join(__dirname, '..', 'web', 'client', 'index.html'));
  } catch (err) {
    return next(err);
  }
});
app.use('/', clientRouter);

// error handler middleware
const errorHandler = (err, req, res, next) => { // eslint-disable-line
  // check if is error from API
  if (req.url.substring(0, 5) === '/api/') {
    return next(err);
  }
  // not belong to API error, render 404 page not found html
  res.status(httpStatus.NOT_FOUND);
  return res.send('<!doctype html><html lang="en"><head><title>A-SLS</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div style="height: 100%">Not found</div></body></html>');
};
// app.use(errorHandler);

// -------------------------------------------------------------------------------
// END - using web server on the same host with API
// -------------------------------------------------------------------------------


// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  console.log('********** ORIGINAL ERROR ********** ', err);  // eslint-disable-line
  // res.status(httpStatus.OK).json(new APIErrorResponse(err))
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  // app.use(expressWinston.errorLogger({
  //   winstonInstance
  // }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
  console.log('-----------------------> FINAL ERROR: ', err); // eslint-disable-line 
  res.status(err.status).json(new APIErrorResponse({
    message: err.isPublic ? err.message : httpStatus[err.status],
    // stack: config.env === 'development' ? err.stack : {}
    stack: err.stack || {}
  }));
});

export default app;
