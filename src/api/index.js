/* eslint-disable */
// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';
import * as subscriptionCtrl from './server/controllers/subscription.controller';

const debug = require('debug')('rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// print log for promise that unhandle rejection
process.on('unhandledRejection', (e) => {
  debug('%s %0', e.message, e.stack);
});

// connect to postgres db
require('./config/db');

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);

    var cron = require('cron');
    var job1 = new cron.CronJob({
      cronTime: '*/2 * * * *',
      onTick: function onTick() {
        subscriptionCtrl.cronUpdateSubscriptionStatus();
      },
      start: false,
      timeZone: process.env.TZ
    });

    var job2 = new cron.CronJob({
      cronTime: '01 00 00 * *',
      onTick: function onTick() {
        console.log('job 2 ticked');
        subscriptionCtrl.cronSendTrialReminderEmail();
      },
      start: false,
      timeZone: process.env.TZ
    });

    job1.start(); // job 1 started
    job2.start(); // job 2 started

  });
}

console.log('==============> process.env.TZ: ', process.env.TZ);
console.log('==============> new Date(): ', new Date());
console.log('==============> new Date().toString(): ', new Date().toString());

export default app;
