/* eslint-disable*/

import httpStatus from 'http-status';

import * as authCtrl from './auth.controller';
import OptionModel from '../models/option.model';
import APIResponse from '../helpers/APIResponse';
import APIError from '../helpers/APIError';
import Utils from '../helpers/Utils';
import constants from '../../config/constants';

const debug = require('debug')('rest-api:option.controller'); // eslint-disable-line

/**
 * Get option list.
 * @returns {OptionModel[]}
 */
export const list = (req, res, next) => { // eslint-disable-line
  return new OptionModel().where('t1.foreign_id=$1').orderBy('t1."order" ASC').findAll([1]).then((data) => { // eslint-disable-line
    return res.json(new APIResponse(data));
  }).catch(e => next(e)); // eslint-disable-line
};

/**
 * Update existing option
 * @returns {OptionModel}
 */
export const update = (req, res, next) => { // eslint-disable-line
  const jwtInfo = authCtrl.getJwtInfo(req); // eslint-disable-line

  const data = req.body || {};

  const foreignId = 1;

  const promises = [];

  for (let prop in data) { // eslint-disable-line
    if (data.hasOwnProperty(prop)) { // eslint-disable-line
      const pattern = new RegExp(/value-(string|text|int|float|enum|bool|color)-(.*)/g);
      if (pattern.test(prop)) {
        const value = data[prop]; // eslint-disable-line
        const arr = prop.split('-'), // eslint-disable-line
          prefix = arr[0], // eslint-disable-line
          type = arr[1], // eslint-disable-line
          key = arr[2]; // eslint-disable-line

        const updateQuery = new OptionModel().where('t1.foreign_id=$1 AND t1.key=$2 AND t1.type=$3').update({ value }, [foreignId, key, type]);
        promises.push(updateQuery);
      }
    }
  }

  return Promise.all(promises).then((results) => { // eslint-disable-line
    // console.log('update result: ', results); // eslint-disable-line
    return res.json(new APIResponse(results)); // eslint-disable-line
  }).catch(e => next(e));
};
