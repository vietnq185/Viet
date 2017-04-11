import PlanModel from '../models/plan.model';
import APIResponse from '../helpers/APIResponse';

const debug = require('debug')('rest-api:plan.controller'); // eslint-disable-line

/**
 * Get user list.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @property {number} req.query.offset - Position to fetch data.
 * @returns {PlanModel[]}
 */
export const list = (req, res, next) => { // eslint-disable-line
  const { limit = 50, offset = 0 } = req.query;
  //  as "courseTitles"
  new PlanModel()
  .select('t1.*, array_length("courseIds", 1) as cnt, ARRAY(SELECT t2.title FROM courses AS t2 WHERE t2._id = ANY(ARRAY[t1."courseIds"])) AS "courseTitles"')
    .limit(limit)
    .offset(offset)
    .orderBy('cnt ASC, "courseTitles" ASC')
    .findAll()
    .then(plans => res.json(new APIResponse(plans)))
    .catch(e => next(e));
};
