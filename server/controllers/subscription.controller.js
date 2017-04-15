import httpStatus from 'http-status';

import * as authCtrl from './auth.controller';
import SubscriptionModel from '../models/subscription.model';
import CCListModel from '../models/cclist.model';
import PlanModel from '../models/plan.model';
import ItemModel from '../models/item.model';
import CourseModel from '../models/course.model';
import UserModel from '../models/user.model';
import APIResponse from '../helpers/APIResponse';
import APIError from '../helpers/APIError';
import Utils from '../helpers/Utils';
import constants from '../../config/constants';

const debug = require('debug')('rest-api:subscription.controller'); // eslint-disable-line


/**
 * Create new subscription
 * @property {string} req.body.parentId
 * @property {string} req.body.planId
 * @property {string} req.body.expirationType
 * @property {string} req.body.type
 * @returns {SubscriptionModel}
 */
export const create = (req, res, next) => {
  //
  const id = Utils.uuid();
  const parentId = req.body.parentId;
  const planId = req.body.planId;
  const expirationType = req.body.expirationType;
  const type = req.body.type;
  const studentId = req.body.studentId;
  const channel =  req.body.chanel;
  // validate parent
  const validateParent = new UserModel().where('t1._id=$1').findCount([parentId]).then((cnt) => {
    const err = new APIError(constants.errors.parentNotFound, httpStatus.OK, true);
    return (cnt > 0 ? Promise.resolve() : Promise.reject(err));
  });

  // validate plan
  const validatePlan = new PlanModel().where('t1._id=$1').findCount([planId]).then((cnt) => {
    const err = new APIError(constants.errors.planNotFound, httpStatus.OK, true);
    return (cnt > 0 ? Promise.resolve() : Promise.reject(err));
  });
  //
  const promises = [validateParent, validatePlan];
  //
  Promise.all(promises).then((results) => { // eslint-disable-line
    // create data
    var data = { // eslint-disable-line
      _id: id,
      parentId,
      planId,
      expirationType,
      type,
      dateCreated: new Date().getTime(),
      dateModified: new Date().getTime(),
      expiryDate: new Date().getTime() + (14 * 86400), //14 days trial
      channel
    };
    // insert
    return new SubscriptionModel().insert(data).then((savedSubscription) => {
      if (savedSubscription === null) {
        return Promise.reject(new APIError(constants.errors.createSubscriptionError, httpStatus.OK, true));
      }
      return Promise.resolve(savedSubscription)
    });
  }).then((savedSubscription) => {
    if (channel == 'bank' && typeof req.body.addCard !== 'undefined') {
      var cardData = {
        _id: Utils.uuid(),
        userId: parentId,
        name: Utils.aesEncrypt(req.body.card_name, constants.ccSecret),
        ccnum: Utils.aesEncrypt(req.body.ccnum, constants.ccSecret),
        ccmonth: Utils.aesEncrypt(req.body.ccmonth, constants.ccSecret),
        ccyear: Utils.aesEncrypt(req.body.ccyear, constants.ccSecret),
        cvv: Utils.aesEncrypt(req.body.cvv, constants.ccSecret),
        dateCreated: new Date().getTime()
      };
      const savedCard = new CCListModel().insert(cardData).then(savedCard);
      debug('card data', savedCard);
      if (savedCard !== null) {
        new SubscriptionModel().where('t1._id::varchar=$1').update({cardId: cardData._id}, [savedSubscription._id]);
      }
    }
    const planItems = [];
    return new PlanModel().getPlanById(planId).then((planData) => {
      if (planData !== null) {
        for(var i=0;i<planData.courseIds.length;i++){
          var dataItem = {
            _id: Utils.uuid(),
            user: studentId,
            creator: parentId,
            dateCreated: new Date().getTime(),
            dateModified: new Date().getTime(),
            order: savedSubscription._id,
            course: planData.courseIds[i]
          };
         const savedItem = new ItemModel().insert(dataItem).then(savedItem);
         planItems[i] = dataItem;
        }
      }
      savedSubscription.planItems = planItems;
      return Promise.resolve(savedSubscription)
    })
  }).then(savedSubscription => res.json(new APIResponse(SubscriptionModel.extractData(savedSubscription)))).catch(e => next(e)); // eslint-disable-line
  //
};

export const assignStudent = (req, res, next) => {
  const subscriptionId = req.body.subscriptionId;
  const studentId = req.body.studentId;

  // validate subscription
  const validateSubscription = new SubscriptionModel().where('t1._id=$1').findCount([subscriptionId]).then((cnt) => {
    const err = new APIError(constants.errors.subscriptionNotFound, httpStatus.OK, true);
    return (cnt > 0 ? Promise.resolve() : Promise.reject(err));
  });

  // validate student
  const validateStudent = new UserModel().where('t1._id=$1').findCount([studentId]).then((cnt) => {
    const err = new APIError(constants.errors.studentNotFound, httpStatus.OK, true);
    return (cnt > 0 ? Promise.resolve() : Promise.reject(err));
  });
  //
  const promises = [validateSubscription, validateStudent];

  Promise.all(promises).then((results) => { // eslint-disable-line
    promises.push(new ItemModel().where('t1.order::varchar=$1').update({user: studentId}, [subscriptionId]));
    return res.json(new APIResponse("Assigned student")); // eslint-disable-line
  }).catch(e => next(e));
};

export const updateSubscriptionCardId = (req, res, next) => {
  const subscriptionId = req.body.subscriptionId;
  const studentId = req.body.studentId;

  // validate subscription
  const validateSubscription = new SubscriptionModel().where('t1._id=$1').findCount([subscriptionId]).then((cnt) => {
    const err = new APIError(constants.errors.subscriptionNotFound, httpStatus.OK, true);
    return (cnt > 0 ? Promise.resolve() : Promise.reject(err));
  });

  // validate student
  const validateStudent = new UserModel().where('t1._id=$1').findCount([studentId]).then((cnt) => {
    const err = new APIError(constants.errors.studentNotFound, httpStatus.OK, true);
    return (cnt > 0 ? Promise.resolve() : Promise.reject(err));
  });
  //
  const promises = [validateSubscription, validateStudent];

  Promise.all(promises).then((results) => { // eslint-disable-line
    promises.push(new ItemModel().where('t1.order::varchar=$1').update({user: studentId}, [subscriptionId]));
    return res.json(new APIResponse("Assigned student")); // eslint-disable-line
  }).catch(e => next(e));
};

/**
 * Get subscriptions list.
 * @property {number} req.query.limit - Limit number of subscriptions to be returned.
 * @property {number} req.query.offset - Position to fetch data.
 * @returns {SubscriptionModel[]}
 */
export const list = (req, res, next, id) => {
  const { limit = 50, offset = 0 } = req.query;
  new SubscriptionModel().where('t1.parentId::varchar=$1').select('t1."_id", t1."parentId", t1."planId", t1."expirationType", t1."type", t1."expiryDate"')
    .limit(limit).offset(offset)
    .findAll()
    .then(subscriptions => res.json(new APIResponse(subscriptions)))
    .catch(e => next(e));
};

export default { list, create, assignStudent, updateSubscriptionCardId};
