/* eslint-disable */
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
import stripePackage from 'stripe';

const debug = require('debug')('rest-api:subscription.controller'); // eslint-disable-line

const createCard = (req) => {
  return new Promise((resolve, reject) => {
    const parentId = req.body.parentId || '';
    const channel = req.body.channel || '';
    if (channel === 'bank' || typeof req.body.addCard === 'undefined') return resolve(null);
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
    var stripe = require("stripe")(constants.StripeSecretKey)
    stripe.tokens.create({
      card: {
        "number": req.body.ccnum,
        "exp_month": req.body.ccmonth,
        "exp_year": req.body.ccyear,
        "cvc": req.body.cvv
      }
    }, function (err, token) {
      if (token) return new CCListModel().insert(cardData).then(resolve).catch(reject);
      return reject(new APIError(constants.errors.invalidCard, httpStatus.OK, true));
    });

  });
}

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
  const parentId = req.body.parentId || '';
  const planId = req.body.planId || '';
  const expirationType = req.body.expirationType || '';
  const type = req.body.type || '';
  const studentId = req.body.studentId || '';
  const channel = req.body.channel || '';
  const cardId = req.body.cardId || '';
  const discount = req.body.discount || 0;
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
    return new PlanModel().getPlanById(planId).then((planData) => {
      if (planData === null) {
        return Promise.reject(new APIError(constants.errors.planNotFound, httpStatus.OK, true));
      }
      return Promise.resolve(planData);
    });
  }).then((planData) => new SubscriptionModel().findCount().then((totalSubscriptions) => {
    var discountValue = 0,
      fee = planData.fee;
    if (parseFloat(discount) > 0 && totalSubscriptions <= 200) {
      discountValue = (fee * discount) / 100;
    }
    fee = fee - discountValue;

    // create data
    var data = { // eslint-disable-line
      _id: id,
      parentId,
      planId,
      expirationType,
      type,
      dateCreated: new Date().getTime(),
      dateModified: new Date().getTime(),
      expiryDateFrom: new Date().getTime(),
      expiryDate: new Date().getTime() + (14 * 86400 * 1000), //14 days trial
      channel,
      fee,
      discount: discountValue,
      status: (channel === 'bank' ? 'pending' : 'trailing')
    };
    if (cardId !== '') {
      data.cardId = cardId;
    }
    /*if (expirationType == 'annually') {
      data.frequency = 'monthly';
    } else {
      data.frequency = 'yearly';
    }*/
    // create card (if any)
    return createCard(req).then(savedCard => {
      if (savedCard !== null) {
        data.cardId = savedCard._id;
      }
      return new SubscriptionModel().insert(data)
    }).then((savedSubscription) => {
      if (savedSubscription === null) {
        return Promise.reject(new APIError(constants.errors.createSubscriptionError, httpStatus.OK, true));
      }
      return Promise.resolve(savedSubscription)
    }).then((savedSubscription) => {
      const planItems = [];
      for (var i = 0; i < planData.courseIds.length; i++) {
        var dataItem = {
          _id: Utils.uuid(),
          creator: parentId,
          dateCreated: new Date().getTime(),
          dateModified: new Date().getTime(),
          order: savedSubscription._id,
          course: planData.courseIds[i]
        };
        if (studentId != '') {
          dataItem.user = studentId;
        }
        const savedItem = new ItemModel().insert(dataItem).then(savedItem);
        planItems[i] = dataItem;
      }
      savedSubscription.planItems = planItems;
      return Promise.resolve(savedSubscription);
    }).then((savedSubscription) => {
      if (!savedSubscription.cardId) {
        return res.json(new APIResponse(SubscriptionModel.extractData(savedSubscription)));
      }
      processPayment(savedSubscription).then((dataResp) => {
        savedSubscription.stripeVerified = 'OK';
        return res.json(new APIResponse(SubscriptionModel.extractData(savedSubscription)));
      }).catch((err) => {
        savedSubscription.stripeVerified = 'FAILED';
        return res.json(new APIResponse(SubscriptionModel.extractData(savedSubscription)));
      });
    }).catch(e => next(e)); // eslint-disable-line;
  })).catch(e => next(e)); // eslint-disable-line
  //
};

export const assignStudent = (req, res, next) => {
  const subscriptionId = req.body.subscriptionId || '';
  const studentId = req.body.studentId || '';

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
    promises.push(new ItemModel().where('t1.order::varchar=$1').update({ user: studentId }, [subscriptionId]));
    return res.json(new APIResponse("Assigned student")); // eslint-disable-line
  }).catch(e => next(e));
};

export const upgrade = (req, res, next) => {
  const { _id = '', channel, cardId } = req.body;
  return new SubscriptionModel().where('t1._id::varchar=$1').findOne([_id]).then((objSubscription) => {
    if (objSubscription === null) {
      return Promise.reject(new APIError(constants.errors.subscriptionNotFound, httpStatus.OK, true));
    }
    if (objSubscription.expirationType === 'annually') {
      return Promise.reject(new APIError(constants.errors.alreadyIsAnnually, httpStatus.OK, true));
    }
    return Promise.resolve(objSubscription);
  }).then((objSubscription) => {
    const data = {
      expirationType: 'annually',
      channel,
      cardId
    };
    return createCard(req).then(savedCard => {
      const paymentMeta = {
        newCard: (savedCard !== null),
        prevPaymentMethod: objSubscription.channel,
        nextPaymentMethod: channel,
      }
      if (savedCard !== null) {
        data.cardId = savedCard._id;
      }
      return new SubscriptionModel().where('t1._id::varchar=$1').update(data, [objSubscription._id]).then((savedSubscription) => {
        if (savedSubscription.length === 0) {
          return Promise.reject(new APIError(constants.errors.cannotUpgrade, httpStatus.OK, true));
        }
        processPayment(Object.assign({}, savedSubscription[0], paymentMeta)).then((dataResp) => {
          savedSubscription.stripeVerified = 'OK';
          return res.json(new APIResponse(SubscriptionModel.extractData(savedSubscription)));
        }).catch((err) => {
          savedSubscription.stripeVerified = 'FAILED';
          return res.json(new APIResponse(SubscriptionModel.extractData(savedSubscription)));
        });
      });
    })
  }).catch(e => next(e)); // eslint-disable-line
};

/**
 * Get subscriptions list.
 * @property {number} req.query.limit - Limit number of subscriptions to be returned.
 * @property {number} req.query.offset - Position to fetch data.
 * @property {userId} - Get data by user.
 * @returns {SubscriptionModel[]}
 */
export const getSubscriptionsByUser = (req, res, next) => {
  const { limit = 10, offset = 0 } = req.query;
  return new SubscriptionModel().where('t1."parentId"::varchar=$1').findCount([req.params.userId]).then((total) => {
    let rowCount = 10,
      pages = Math.ceil(total / rowCount),
      page = 1;
    if (req.params.page != undefined && parseInt(req.params.page) > 0) {
      page = parseInt(req.params.page);
    }
    let offset = (parseInt(page) - 1) * rowCount;
    if (page > pages) {
      page = pages;
    }

    const iModel = new ItemModel();
    const pModel = new PlanModel();
    const cModel = new CourseModel();
    new SubscriptionModel().where('t1."parentId"::varchar=$1')
      .select(`t1."_id", t1."parentId", t1."planId", t1."expirationType", t1."type", t1.refid,
        t1."expiryDate", t1.discount, t1.fee, t1.status, t1."dateCreated", t1.channel, t1."cardId", 
        ARRAY(SELECT t2.title FROM ${cModel.getTable()} AS t2 
          INNER JOIN ${pModel.getTable()} AS t3 ON t2._id = ANY(ARRAY[t3."courseIds"])
          WHERE t3._id=t1."planId") AS "courseTitles", (SELECT t4.user FROM ${iModel.getTable()} AS t4 WHERE t4.order=t1._id Limit 1) AS "studentId"`)
      .orderBy('t1."dateCreated" DESC')
      .limit(limit).offset(offset)
      .findAll([req.params.userId])
      .then((subscriptions) => {
        const result = {
          subscriptions,
          page,
          totalPages: pages
        };
        return res.json(new APIResponse(result));
      })
      .catch(e => next(e));
  });
};

export const countSubscriptions = (req, res, next) => new SubscriptionModel().findCount().then((total) => {
  return res.json(new APIResponse(total))
}).catch(e => next(e));

export const getSubscriptionById = (req, res, next) => {
  const cModel = new CourseModel();
  const pModel = new PlanModel();
  const ccModel = new CCListModel();
  const uModel = new UserModel();
  const iModel = new ItemModel();
  return new SubscriptionModel().select(`t1.*,
      ARRAY(SELECT t2.title FROM ${cModel.getTable()} AS t2 
            INNER JOIN ${pModel.getTable()} AS t3 ON t2._id = ANY(ARRAY[t3."courseIds"])
            WHERE t3._id=t1."planId") AS "courseTitles", t4.name, t4.ccnum, t4.ccmonth, t4.ccyear, t4.cvv,
      (SELECT t5.user FROM ${iModel.getTable()} AS t5 WHERE t5.order=t1._id Limit 1) AS "studentId"
    `)
    .join(`${ccModel.getTable()} AS t4`, 't1."cardId"::varchar=t4."_id"::varchar', 'left') // eslint-disable-line
    .where('t1._id::varchar=$1').findOne([req.params.subscriptionId]).then((subscription) => { // eslint-disable-line
      if (subscription !== null) {
        const flist = ['name', 'ccnum', 'ccmonth', 'ccyear', 'cvv'];
        try {
          for (let j = 0; j < flist.length; j++) { // eslint-disable-line
            const fn = flist[j];
            subscription[fn] = Utils.aesDecrypt(subscription[fn], constants.ccSecret); // eslint-disable-line
            if (fn === 'ccnum') {
              subscription[fn] = (subscription[fn] + '').replace(/.(?=.{4,}$)/g, "*"); // eslint-disable-line
            }
          }
        } catch (ex) { } // eslint-disable-line
        subscription.items = [] // eslint-disable-line
        return new ItemModel()
          .select('t1.*, t2."firstName", t2."lastName", t2."email", t2."metadata" AS "studentInfo"')
          .where('t1.order=$1')
          .join(`${uModel.getTable()} AS t2`, 't1."user"=t2."_id"', 'left outer') // eslint-disable-line
          .findAll([subscription._id])
          .then((items) => {
            subscription.items = items; // eslint-disable-line
            return res.json(new APIResponse(subscription));
          })
          .catch(e => next(e));
      }
      return res.json(new APIResponse({ msg: constants.errors.subscriptionNotFound }));
    }).catch(e => next(e));
};

export const changeStatus = (req, res, next) => {
  const id = req.params.subscriptionId || '';
  const status = req.params.newStatus || '';

  const sModel = new SubscriptionModel();

  return sModel.reset().where('t1._id::varchar=$1').findCount([id]).then(cnt => {
    if (cnt === 0) {
      return res.json({
        success: false,
        message: 'Subscription not found'
      });
    }
    const allowList = ['pending', 'trailing', 'active', 'overdue', 'cancelled'];
    if (allowList.indexOf(status) === -1) {
      return res.json({
        success: false,
        message: 'Not allow status',
        allowList
      });
    }
    return sModel.reset().where('t1._id::varchar=$1').update({ status }, [id]).then(result => {
      if (result === null) {
        return res.json({
          success: false,
          message: 'Update failed'
        });
      }
      return res.json({
        success: true,
        message: 'OK',
        newStatus: status
      });
    }).catch(e => res.json({
      success: false,
      message: 'Error. Try again later.'
    }))
  }).catch(e => res.json({
    success: false,
    message: 'Error. Try again later.'
  }));
};

var processPayment = function (subscription) {
  const ccModel = new CCListModel();
  const uModel = new UserModel();
  return new Promise((resolve, reject) => {
    if (!subscription) return resolve({ isVerified: false });

    return new SubscriptionModel().select(`t1.*, t2.name, t2.ccnum, t2.ccmonth, t2.ccyear, t2.cvv,
      t3."firstName" AS "parentFirstName", t3."lastName" AS "parentLastName",t3."email" AS "parentEmail"
    `)
      .join(`${ccModel.getTable()} AS t2`, 't1."cardId"::varchar=t2."_id"::varchar', 'left') // eslint-disable-line
      .join(`${uModel.getTable()} AS t3`, 't1."parentId"::varchar=t3."_id"::varchar', 'left') // eslint-disable-line
      .where('t1._id::varchar=$1').findOne([subscription._id]).then((subscriptionData) => { // eslint-disable-line
        if (!subscriptionData) return resolve({ isVerified: false });
        const flist = ['name', 'ccnum', 'ccmonth', 'ccyear', 'cvv'];
        try {
          for (let j = 0; j < flist.length; j++) { // eslint-disable-line
            const fn = flist[j];
            subscriptionData[fn] = Utils.aesDecrypt(subscriptionData[fn], constants.ccSecret); // eslint-disable-line
          }
        } catch (ex) { } // eslint-disable-line

        var stripe = require("stripe")(constants.StripeSecretKey),
          planSubscription = 'subscription-asls-monthly-fee';
        if (subscriptionData.expirationType == 'annually') {
          planSubscription = 'subscription-asls-yearly-fee';
        };
        /* check if plans do not exists then create */
        stripe.plans.retrieve(
          "subscription-asls-monthly-fee",
          function (err, plan) {
            if (!plan) {
              var planMonthly = stripe.plans.create({
                name: "Subscription - ASLS Monthly Fee",
                id: "subscription-asls-monthly-fee",
                interval: "month",
                currency: "usd",
                amount: parseInt(subscriptionData.fee) * 100,
              }, function (err, plan) {

              });
            }
          }
        );

        stripe.plans.retrieve(
          "subscription-asls-yearly-fee",
          function (err, plan) {
            if (!plan) {
              var planYearly = stripe.plans.create({
                name: "Subscription - ASLS Yearly Fee",
                id: "subscription-asls-yearly-fee",
                interval: "year",
                currency: "usd",
                amount: parseInt(subscriptionData.fee) * 12 * 100,
              }, function (err, plan) {

              });
            }
          }
        );
        /* end check if plans do not exists then create */

        /* check if customer does not exists in stripe the create new customer */
        if (subscriptionData.stripeCustomerId != null && subscriptionData.stripeSubscriptionId != null) {
          console.log(subscriptionData.stripeCustomerId + " " + subscriptionData.stripeSubscriptionId);
          stripe.subscriptions.update(
            subscriptionData.stripeSubscriptionId,
            { plan: planSubscription },
            function (err, subscriptionResp) {
              if (!subscriptionResp) return resolve({ isVerified: false });
              return resolve({ isVerified: true });
            }
          );
        } else {
          stripe.customers.create({
            email: subscriptionData.parentEmail
          }).then(function (customer) {
            return stripe.customers.createSource(customer.id, {
              source: {
                object: 'card',
                exp_month: subscriptionData.ccmonth,
                exp_year: subscriptionData.ccyear,
                number: subscriptionData.ccnum,
                cvc: subscriptionData.cvv,
                name: subscriptionData.parentFirstName + " " + subscriptionData.parentLastName
              }
            });
          }).then(function (source) {
            stripe.subscriptions.create({
              customer: source.customer,
              plan: planSubscription,
              trial_period_days: 14
            }, function (err, subscriptionResp) {
              if (subscriptionResp) {
                return new SubscriptionModel().where('t1._id::varchar=$1').update({ stripeCustomerId: subscriptionResp.customer, stripeSubscriptionId: subscriptionResp.id }, [subscriptionData._id]).then(dataUpdated => {
                  if (!dataUpdated) return resolve({ isVerified: false });
                  return resolve({ isVerified: true });
                });
              }
            }
            );
          });
        }
      });
  })
};

export const paySubscription = (req, res, next) => {
  const cModel = new CourseModel();
  const pModel = new PlanModel();
  const ccModel = new CCListModel();
  const iModel = new ItemModel();
  const uModel = new UserModel();
  return new SubscriptionModel().select(`t1.*`)
    .where('t1._id::varchar=$1').findOne([req.params.subscriptionId]).then((subscription) => { // eslint-disable-line
      if (subscription !== null) {
        processPayment(subscription).then((dataResp) => {
          return res.json(new APIResponse({ status: 'OK', msg: constants.errors.subscriptionPaidSuccessful }));
        }).catch((err) => {
          return res.json(new APIResponse({ status: 'FAILED', msg: constants.errors.subscriptionPaidUnSuccessful }));
        });
      }
    }).catch(e => next(e));
};

export default { getSubscriptionsByUser, create, assignStudent, upgrade, countSubscriptions, getSubscriptionById, paySubscription };
