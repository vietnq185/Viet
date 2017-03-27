/*eslint-disable*/

import pg from 'pg';
import { parse } from 'pg-connection-string';

import config from './config';

const debug = require('debug')('rest-api:db');

var pgConfig = parse(config.postgres);

var count = 0;

var pool = null;

if (pool === null) {
  pool = new pg.Pool(pgConfig);

  //
  pool.on('connect', (client) => {
    client.count = ++count;
    debug('postgres conneted clients: ', client.count);
  });

  //
  pool.on('error', (err, client) => {
    debug('postgres idle client error: ', err.message, err.stack);
  });
}

export default pool;

export const getClient = () => {
  return new Promise((resolve, reject) => {
    if (pool !== null) {
      return pool.connect().then(resolve).catch(reject);
    }
    debug('getClient => postgres pool is not ready');
    return reject(new Error('postgres pool is not ready'));
  });
}
