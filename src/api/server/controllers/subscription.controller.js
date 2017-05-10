/* eslint-disable */
import httpStatus from 'http-status';

import * as authCtrl from './auth.controller';
import SubscriptionModel from '../models/subscription.model';
import CCListModel from '../models/cclist.model';
import PlanModel from '../models/plan.model';
import ItemModel from '../models/item.model';
import CourseModel from '../models/course.model';
import UserModel from '../models/user.model';
import PaymentHistory from '../models/paymentHistory.model';
import OptionModel from '../models/option.model';
import APIResponse from '../helpers/APIResponse';
import APIError from '../helpers/APIError';
import Utils from '../helpers/Utils';
import constants from '../../config/constants';
import stripePackage from 'stripe';
const moment = require('moment')

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

    return new OptionModel().getPairs(1).then((dataResp) => {
      var stripe = require("stripe")(dataResp.o_stripe_secret)
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
    }).catch((err) => {
      return res.json(new APIResponse({ status: 'FAILED', msg: 'Can not get Options' }));
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
    return new OptionModel().getPairs(1).then((optionResp) => {
      var discountValue = 0,
        oAllowDiscount = optionResp.o_allow_discount || 0,
        oDiscountPercent = optionResp.o_discount_percent || 0,
        oDiscountLimit = optionResp.o_discount_limit | 0,
        oRemainingDiscountSubscription = optionResp.o_remaining_discount_subscription | 0,
        fee = planData.fee;
      if (parseInt(oAllowDiscount) === 1 && parseFloat(oDiscountPercent) > 0 && oRemainingDiscountSubscription > 0) {
        discountValue = (fee * oDiscountPercent) / 100;
      }
      fee = fee - discountValue;

      // create data
      var expiryDate = new Date().getTime() + (optionResp.o_trial_days * 86400 * 1000),
        dateCreated = new Date().getTime(); //14 days trial
      var data = { // eslint-disable-line
        _id: id,
        parentId,
        planId,
        expirationType,
        type,
        dateCreated: dateCreated,
        dateModified: dateCreated,
        expiryDateFrom: dateCreated,
        expiryDate: expiryDate,
        nextPeriodStart: expiryDate,
        nextPeriodEnd: expiryDate,
        nextChannel: channel,
        nextExpirationType: expirationType,
        channel,
        fee,
        discount: discountValue,
        status: (channel === 'bank' ? 'pending' : 'trialing')
      };
      if (cardId !== '') {
        data.cardId = cardId;
      }

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
        /* send email to parent */
        return new UserModel().reset().select(`t1.*`)
          .where('t1._id::varchar=$1').findOne([parentId]).then((user) => { // eslint-disable-line
            Utils.sendMail({
              to: user.email,
              template: 'mail_sign_up_confirmation',
              data: {
                firstName: user.firstName,
                lastName: user.lastName
              }
            });

            if (savedSubscription.channel === 'bank') {
              Utils.sendMail({
                to: user.email,
                template: 'mail_bank_transfer_instruction',
                data: {
                  firstName: user.firstName,
                  lastName: user.lastName
                }
              });

              Utils.sendMail({
                to: optionResp.o_admin_email,
                template: 'mail_subscribe_via_bank_transfer',
                data: {
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName
                }
              });
            }

            if (!savedSubscription.cardId) {
              return res.json(new APIResponse(SubscriptionModel.extractData(savedSubscription)));
            }
            if (oRemainingDiscountSubscription > 0) {
              oRemainingDiscountSubscription -= 1;
            } else {
              oRemainingDiscountSubscription = 0;
            }
            return new OptionModel().reset().where('t1.key::varchar=$1').update({ value: oRemainingDiscountSubscription }, ['o_remaining_discount_subscription']).then((updateOptions) => {
              return processPayment(savedSubscription).then((dataResp) => {
                savedSubscription.stripeStatus = dataResp.status;
                savedSubscription.stripeMsg = data.msg;
                return res.json(new APIResponse(SubscriptionModel.extractData(savedSubscription)));
              }).catch((err) => {
                savedSubscription.stripeStatus = 'FAILED';
                return res.json(new APIResponse(SubscriptionModel.extractData(savedSubscription)));
              });
            });
          }).catch(e => next(e));

      }).catch(e => next(e)); // eslint-disable-line;
    }).catch((err) => {
      return Promise.reject(new APIError('CAN_NOT_RETRIEVE_OPTIONS', httpStatus.OK, true));
    });
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
  const { _id = '', channel, cardId, isUpgradePlan = '' } = req.body;
  return new SubscriptionModel().where('t1._id::varchar=$1').findOne([_id]).then((objSubscription) => {
    if (objSubscription === null) {
      return Promise.reject(new APIError(constants.errors.subscriptionNotFound, httpStatus.OK, true));
    }
    if (objSubscription.expirationType === 'annually') {
      return Promise.reject(new APIError(constants.errors.alreadyIsAnnually, httpStatus.OK, true));
    }
    return Promise.resolve(objSubscription);
  }).then((objSubscription) => {
    var ts = new Date().getTime(),
      nextPeriodStart = objSubscription.expiryDate > ts ? objSubscription.expiryDate : ts,
      tsNextPeriodStart = moment.unix(nextPeriodStart / 1000),
      nextPeriodEnd = moment(tsNextPeriodStart.add(moment.duration(1, 'year'))).unix() * 1000;
    const data = {
      nextPeriodStart,
      nextPeriodEnd,
      nextChannel: channel,
      nextExpirationType: 'annually',
      cardId
    };
    return createCard(req).then(savedCard => {
      const paymentMeta = {
        newCard: (savedCard !== null),
        prevPaymentMethod: objSubscription.channel,
        nextPaymentMethod: channel,
        isUpgradePlan
      }
      if (savedCard !== null) {
        data.cardId = savedCard._id;
      }
      return new SubscriptionModel().where('t1._id::varchar=$1').update(data, [objSubscription._id]).then((savedSubscription) => {
        if (savedSubscription.length === 0) {
          return Promise.reject(new APIError(constants.errors.cannotUpgrade, httpStatus.OK, true));
        }
        savedSubscription = savedSubscription[0];
        return processPayment(Object.assign({}, savedSubscription, paymentMeta)).then((dataResp) => {
          savedSubscription.stripeStatus = dataResp.status;
          savedSubscription.stripeMsg = dataResp.msg;
          return res.json(new APIResponse(SubscriptionModel.extractData(savedSubscription)));
        }).catch((err) => {
          savedSubscription.stripeStatus = 'FAILED';
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
        t1."expiryDate", t1.discount, t1.fee, t1.status, t1."dateCreated", t1.channel, t1."cardId", t1."nextPeriodStart", t1."nextPeriodEnd", t1."nextChannel", t1."nextExpirationType", t1."cancelMetadata", 
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
  const uModel = new UserModel();
  const iModel = new ItemModel();
  const pModel = new PlanModel();
  const cModel = new CourseModel();

  return new OptionModel().getPairs().then((dataResp) => {
    return sModel.reset().where('t1._id::varchar=$1').findOne([id]).then(subscriptionData => {
      if (subscriptionData === null) {
        return next(new APIError('SUBSCRIPTION_NOT_FOUND', httpStatus.OK, true));
      }
      const allowList = ['pending', 'trialing', 'active', 'overdue', 'cancelled'];
      if (allowList.indexOf(status) === -1) {
        return next(new APIError('NOT_ALLOW_STATUS', httpStatus.OK, true));
      }

      const authData = authCtrl.getJwtInfo(req),
        dataUpdate = {
          status
        };

      if (authData.isAdmin && status === 'active' && subscriptionData.status !== 'active') {
        var period = subscriptionData.nextExpirationType == 'monthly' ? 'month' : 'year',
          ts = new Date().getTime(),
          expiryDateFrom = subscriptionData.expiryDate > ts ? subscriptionData.expiryDate : ts,
          tsExpiryDateFrom = moment.unix(expiryDateFrom / 1000),
          expiryDate = moment(tsExpiryDateFrom.add(moment.duration(1, period))).unix() * 1000;
        dataUpdate.expiryDateFrom = expiryDateFrom;
        dataUpdate.expiryDate = expiryDate;
      }
      return sModel.reset().where('t1._id::varchar=$1').update(dataUpdate, [id]).then(result => {
        if (result === null) {
          return next(new APIError('UPDATE_FAILED', httpStatus.OK, true));
        }
        return sModel.reset().select(`t1.*, t2."firstName", t2."lastName", t2.email,
        ARRAY(SELECT t3.title FROM ${cModel.getTable()} AS t3 
          INNER JOIN ${pModel.getTable()} AS t4 ON t3._id = ANY(ARRAY[t4."courseIds"])
          WHERE t4._id=t1."planId") AS "courseTitles"
      `)
          .where('t1._id::varchar=$1')
          .join(`${uModel.getTable()} AS t2`, 't1."parentId"::varchar=t2."_id"::varchar', 'left') // eslint-disable-line
          .findOne([id]).then((subscription) => { // eslint-disable-line
            if (subscription !== null) {
              if (authData.isAdmin && subscription.channel === 'bank') {
                if (status === 'trialing') {
                  Utils.sendMail({
                    to: subscription.email,
                    template: 'mail_bank_transfer_activation',
                    data: {
                      firstName: subscription.firstName,
                      lastName: subscription.lastName,
                      subscriptionLink: dataResp.o_website_url + '/subscription-details/' + subscription._id
                    }
                  });
                }

                if (status === 'active') {
                  Utils.sendMail({
                    to: subscription.email,
                    template: 'mail_bank_transfer_reactivate_subscription',
                    data: {
                      firstName: subscription.firstName,
                      lastName: subscription.lastName,
                      subject: [subscription.courseTitles || ''].join(" & "),
                      periodStart: moment.unix(subscription.expiryDateFrom / 1000).format('MMM D, YYYY'),
                      periodEnd: moment.unix(subscription.expiryDate / 1000).format('MMM D, YYYY'),
                      periodPrice: '$' + parseFloat(subscription.fee * 12),
                    }
                  });
                }

              }

              if (subscription.stripeSubscriptionId !== null) {
                return new OptionModel().getPairs(1).then((dataResp) => {
                  var stripe = require("stripe")(dataResp.o_stripe_secret);
                  stripe.subscriptions.del(subscription.stripeSubscriptionId,
                    function (err, confirmation) {
                      return res.json(new APIResponse({ newStatus: status }));
                    }
                  );
                }).catch((err) => {
                  return next(new APIError('CAN_NOT_RETRIEVE_OPTIONS', httpStatus.OK, true));
                });
              }
              return res.json(new APIResponse({ newStatus: status }));
            } else {
              return next(new APIError('UPDATE_FAILED', httpStatus.OK, true));
            }
          }).catch(e => next(e));
      }).catch(e => next(e))
    }).catch(e => next(e));
  }).catch(e => next(e));
};

var processPayment = function (subscription) {
  const ccModel = new CCListModel();
  const uModel = new UserModel();
  return new Promise((resolve, reject) => {
    if (!subscription) return resolve({ status: 'FAILED', msg: 'Subscription nout found' });
    return new SubscriptionModel().select(`t1.*, t2.name, t2.ccnum, t2.ccmonth, t2.ccyear, t2.cvv,
      t3."firstName" AS "parentFirstName", t3."lastName" AS "parentLastName",t3."email" AS "parentEmail"
    `)
      .join(`${ccModel.getTable()} AS t2`, 't1."cardId"::varchar=t2."_id"::varchar', 'left') // eslint-disable-line
      .join(`${uModel.getTable()} AS t3`, 't1."parentId"::varchar=t3."_id"::varchar', 'left') // eslint-disable-line
      .where('t1._id::varchar=$1').findOne([subscription._id]).then((subscriptionData) => { // eslint-disable-line
        if (!subscriptionData) return resolve({ status: 'FAILED', msg: 'Subscription nout found' });
        const flist = ['name', 'ccnum', 'ccmonth', 'ccyear', 'cvv'];
        try {
          for (let j = 0; j < flist.length; j++) { // eslint-disable-line
            const fn = flist[j];
            subscriptionData[fn] = Utils.aesDecrypt(subscriptionData[fn], constants.ccSecret); // eslint-disable-line
          }
        } catch (ex) { } // eslint-disable-line

        return new OptionModel().getPairs(1).then((dataResp) => {
          var upgradePlan = subscription.isUpgradePlan || '',
            stripe = require("stripe")(dataResp.o_stripe_secret),
            planFee = parseInt(subscriptionData.fee) * 100,
            planSubscription = "subscription-asls-monthly-fee-" + planFee,
            planInterval = 'month';
          if (subscriptionData.expirationType === 'annually' || upgradePlan === 1) {
            planFee = parseInt(subscriptionData.fee) * 12 * 100;
            planSubscription = 'subscription-asls-yearly-fee' + planFee;
            planInterval = 'year';
          };

          /* check if plans do not exists then create */
          stripe.plans.retrieve(
            planSubscription,
            function (err, plan) {
              if (!plan) {
                var planMonthly = stripe.plans.create({
                  name: "ASLS Subscription Fee",
                  id: planSubscription,
                  interval: planInterval,
                  currency: "usd",
                  amount: planFee,
                }, function (err, plan) {

                });
              }
            }
          );
          /* end check if plans do not exists then create */

          if (upgradePlan === 1) { //upgrade
            switch (subscription.nextPaymentMethod) {
              case 'bank':
                stripe.subscriptions.retrieve(
                  subscriptionData.stripeSubscriptionId,
                  function (err, subscription) {
                    if (subscription) {
                      stripe.subscriptions.del(subscriptionData.stripeSubscriptionId,
                        function (err, confirmation) {
                          if (confirmation) {
                            return resolve({ status: 'OK', msg: 'Subscription has been upgraded' });
                          } else {
                            return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                          }
                        }
                      );
                    } else {
                      return resolve({ status: 'OK', msg: 'Subscription has been upgraded' });
                    }
                  }
                );
                break;
              default:
                var stripeSubscriptionId = subscriptionData.stripeSubscriptionId || '',
                  stripeCustomerId = subscriptionData.stripeCustomerId || '';

                stripe.customers.retrieve(
                  stripeCustomerId,
                  function (err, customer) {
                    if (!customer) {
                      stripe.customers.create({
                        email: subscriptionData.parentEmail
                      }, function (err, customer) {
                        if (!customer) return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded. Can not create customer' });
                        stripeCustomerId = customer.id;
                        stripe.customers.createSource(customer.id, {
                          source: {
                            object: 'card',
                            exp_month: subscriptionData.ccmonth,
                            exp_year: subscriptionData.ccyear,
                            number: subscriptionData.ccnum,
                            cvc: subscriptionData.cvv,
                            name: subscriptionData.parentFirstName + " " + subscriptionData.parentLastName
                          }
                        });
                        stripe.subscriptions.retrieve(
                          stripeSubscriptionId,
                          function (err, subscription) {
                            if (!subscription) {
                              var expiryDate = moment(moment.unix(subscriptionData.expiryDate / 1000).format('YYYY-MM-DD')),
                                expiryDateFrom = moment(moment.unix(subscriptionData.expiryDateFrom / 1000).format('YYYY-MM-DD')),
                                trialPrdioDays = expiryDate.diff(expiryDateFrom, 'days');
                              if (trialPrdioDays < 0) {
                                trialPrdioDays = 0;
                              }
                              stripe.subscriptions.create({
                                customer: stripeCustomerId,
                                plan: planSubscription,
                                trial_period_days: trialPrdioDays
                              }, function (err, subscriptionResp) {
                                if (subscriptionResp) {
                                  stripeSubscriptionId = subscriptionResp.id;
                                  if (stripeCustomerId === null || stripeSubscriptionId === null) {
                                    return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                  } else {
                                    return new SubscriptionModel().where('t1._id::varchar=$1').update({ stripeCustomerId: stripeCustomerId, stripeSubscriptionId: stripeSubscriptionId }, [subscriptionData._id]).then(dataUpdated => {
                                      if (!dataUpdated) return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                      return resolve({ status: 'OK', msg: 'Subscription has been upgraded' });
                                    });
                                  }
                                } else {
                                  return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                }
                              }
                              );
                            } else {
                              stripe.subscriptions.update(
                                stripeSubscriptionId,
                                {
                                  plan: planSubscription,
                                  trial_end: moment.unix(subscriptionData.expiryDate / 1000).unix(),
                                  prorate: false
                                },
                                function (err, subscriptionResp) {
                                  if (subscriptionResp) {
                                    if (stripeCustomerId === null || stripeSubscriptionId === null) {
                                      return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                    } else {
                                      return new SubscriptionModel().where('t1._id::varchar=$1').update({ stripeCustomerId: stripeCustomerId, stripeSubscriptionId: stripeSubscriptionId }, [subscriptionData._id]).then(dataUpdated => {
                                        if (!dataUpdated) return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                        return resolve({ status: 'OK', msg: 'Subscription has been upgraded' });
                                      });
                                    }
                                  } else {
                                    return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                  }
                                }
                              );
                            }
                          }
                        );
                      })
                    } else {
                      stripe.customers.update(stripeCustomerId, {
                        description: "Update plan for customer" + subscriptionData.parentEmail,
                        source: {
                          object: 'card',
                          exp_month: subscriptionData.ccmonth,
                          exp_year: subscriptionData.ccyear,
                          number: subscriptionData.ccnum,
                          cvc: subscriptionData.cvv,
                          name: subscriptionData.parentFirstName + " " + subscriptionData.parentLastName
                        }
                      }, function (err, customer) {
                        stripe.subscriptions.retrieve(
                          stripeSubscriptionId,
                          function (err, subscription) {
                            if (!subscription) {
                              var expiryDate = moment(moment.unix(subscriptionData.expiryDate / 1000).format('YYYY-MM-DD')),
                                expiryDateFrom = moment(moment.unix(subscriptionData.expiryDateFrom / 1000).format('YYYY-MM-DD')),
                                trialPrdioDays = expiryDate.diff(expiryDateFrom, 'days');
                              if (trialPrdioDays < 0) {
                                trialPrdioDays = 0;
                              }
                              stripe.subscriptions.create({
                                customer: stripeCustomerId,
                                plan: planSubscription,
                                trial_period_days: trialPrdioDays
                              }, function (err, subscriptionResp) {
                                if (subscriptionResp) {
                                  stripeSubscriptionId = subscriptionResp.id;
                                  if (stripeCustomerId === null || stripeSubscriptionId === null) {
                                    return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                  } else {
                                    return new SubscriptionModel().where('t1._id::varchar=$1').update({ stripeCustomerId: stripeCustomerId, stripeSubscriptionId: stripeSubscriptionId }, [subscriptionData._id]).then(dataUpdated => {
                                      if (!dataUpdated) return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                      return resolve({ status: 'OK', msg: 'Subscription has been upgraded' });
                                    });
                                  }
                                } else {
                                  return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                }
                              }
                              );
                            } else {
                              stripe.subscriptions.update(
                                stripeSubscriptionId,
                                {
                                  plan: planSubscription,
                                  trial_end: moment.unix(subscriptionData.expiryDate / 1000).unix(),
                                  prorate: false
                                },
                                function (err, subscriptionResp) {
                                  if (subscriptionResp) {
                                    if (stripeCustomerId === null || stripeSubscriptionId === null) {
                                      return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                    } else {
                                      return new SubscriptionModel().where('t1._id::varchar=$1').update({ stripeCustomerId: stripeCustomerId, stripeSubscriptionId: stripeSubscriptionId }, [subscriptionData._id]).then(dataUpdated => {
                                        if (!dataUpdated) return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                        return resolve({ status: 'OK', msg: 'Subscription has been upgraded' });
                                      });
                                    }
                                  } else {
                                    return resolve({ status: 'FAILED', msg: 'Subscription has not been upgraded' });
                                  }
                                }
                              );
                            }
                          }
                        );
                      });
                    }
                  }
                );

                break;
            }
          } else { // create when register subscription
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
                //trial_period_days: dataResp.o_trial_days,
                trial_end: moment.unix(subscriptionData.expiryDate / 1000).unix()
              }, function (err, subscriptionResp) {
                if (subscriptionResp) {
                  return new SubscriptionModel().where('t1._id::varchar=$1').update({ stripeCustomerId: subscriptionResp.customer, stripeSubscriptionId: subscriptionResp.id }, [subscriptionData._id]).then(dataUpdated => {
                    if (!dataUpdated) return resolve({ status: 'FAILED', msg: 'Failed to create subscription on Stripe' });
                    return resolve({ status: 'OK', msg: 'Subscription has been created on Stripe' });
                  });
                }
              }
              );
            });
          }
        }).catch((err) => {
          return resolve({ status: 'FAILED', msg: 'Can not retrieve options' });
        });

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
        return processPayment(subscription).then((dataResp) => {
          return res.json(new APIResponse({ status: 'OK', msg: constants.errors.subscriptionPaidSuccessful }));
        }).catch((err) => {
          return res.json(new APIResponse({ status: 'FAILED', msg: constants.errors.subscriptionPaidUnSuccessful }));
        });
      }
    }).catch(e => next(e));
};

export const stripeConfirmation = (req, res, next) => {
  const uModel = new UserModel();
  const iModel = new ItemModel();
  const pModel = new PlanModel();
  const cModel = new CourseModel();
  return new OptionModel().getPairs().then((dataResp) => {
    var stripe = require("stripe")(dataResp.o_stripe_secret),
      stripeResp = req.body;
    console.log("=======================> stripeConfirmation => stripeResponse ", stripeResp)
    // Verify the event by fetching it from Stripe
    stripe.events.retrieve(stripeResp.id, function (err, event) {
      console.log("=======================> stripeConfirmation => stripeEvent ", event)
      if (!event) return res.json(new APIResponse("Stripe - Event not found")); // eslint-disable-line

      var invoice = event.data.object,
        stripeCustomerId = invoice.customer;
      return new SubscriptionModel().select(`t1.*, t2."firstName", t2."lastName", t2."email", ARRAY(SELECT t3.title FROM ${cModel.getTable()} AS t3  INNER JOIN ${pModel.getTable()} AS t4 ON t3._id = ANY(ARRAY[t4."courseIds"]) WHERE t4._id=t1."planId") AS "courseTitles"`)
        .where('t1."stripeCustomerId"::varchar=$1')
        .join(`${uModel.getTable()} AS t2`, 't1."parentId"=t2."_id"', 'left outer') // eslint-disable-line
        .limit(1).findOne([stripeCustomerId]).then((subscription) => { // eslint-disable-line
          console.log("=======================> stripeConfirmation => stripeSubscription ", subscription)
          if (subscription === null) return res.json(new APIResponse("Stripe - Subscription not found")); // eslint-disable-line

          if (stripeResp.type === 'charge.succeeded') {
            const dataHistory = {
              _id: Utils.uuid(),
              subscriptionId: subscription._id,
              paymentMethod: 'stripe',
              chargeId: invoice.id,
              txnid: invoice.balance_transaction,
              paymentStatus: invoice.status,
              paymentType: 'payment',
              amount: (invoice.amount / 100),
              paymentDate: new Date().getTime()
            };

            var period = subscription.nextExpirationType == 'monthly' ? 'month' : 'year',
              ts = new Date().getTime(),
              expiryDateFrom = subscription.expiryDate > ts ? subscription.expiryDate : ts,
              tsExpiryDateFrom = moment.unix(expiryDateFrom / 1000),
              expiryDate = moment(tsExpiryDateFrom.add(moment.duration(1, period))).unix() * 1000,
              tsExpiryDate = moment.unix(expiryDate / 1000),
              nextPeriodEnd = moment(tsExpiryDate.add(moment.duration(1, period))).unix() * 1000;
            const dataUpdate = {
              status: 'active',
              expiryDateFrom,
              expiryDate,
              stripeChargeId: invoice.id
            }
            return new SubscriptionModel().where('t1._id::varchar=$1').update(dataUpdate, [subscription._id]).then(savedDataUpdated => {
              console.log("=======================> stripeConfirmation => savedDataUpdated ==> Payment success: ", savedDataUpdated)
              return new PaymentHistory().insert(dataHistory).then(savedHistory => {
                var fee = subscription.fee;
                if (subscription.expirationType === 'annually') {
                  fee = fee * 12;
                }
                Utils.sendMail({
                  to: subscription.email,
                  template: 'mail_successful_charge',
                  data: {
                    firstName: subscription.firstName,
                    lastName: subscription.lastName,
                    price: '$' + fee,
                    type: subscription.expirationType,
                    subject: [subscription.courseTitles || ''].join(" & "),
                    subscriptionDetailsLink: dataResp.o_website_url + '/subscription-details/' + subscription._id,
                  }
                });
                return res.json(new APIResponse({ status: 'OK', msg: 'Payment successful - subscription has been activated' }));
              }).catch(e => next(e));
            }).catch(e => next(e));
          } else if (stripeResp.type === 'charge.failed') {
            const dataHistory = {
              _id: Utils.uuid(),
              subscriptionId: subscription._id,
              paymentMethod: 'stripe',
              chargeId: invoice.id,
              txnid: invoice.balance_transaction,
              paymentStatus: invoice.status,
              paymentType: 'payment',
              amount: (invoice.amount / 100),
              paymentDate: new Date().getTime()
            };

            return new SubscriptionModel().where('t1._id::varchar=$1').update({ status: 'overdue' }, [subscription._id]).then(savedDataUpdated => {
              console.log("=======================> stripeConfirmation => savedDataUpdated ==> Payment failed: ", savedDataUpdated)
              return new PaymentHistory().insert(dataHistory).then(savedHistory => {
                return res.json(new APIResponse({ status: 'OK', msg: 'Payment failed - subscription status has been changed to overdue' }));
              }).catch(e => next(e));
            }).catch(e => next(e));
          } else if (stripeResp.type === 'charge.refunded') {
            console.log("=======================> stripeConfirmation => Refund")
            const dataHistory = {
              _id: Utils.uuid(),
              subscriptionId: subscription._id,
              paymentMethod: 'stripe',
              chargeId: invoice.id,
              txnid: invoice.balance_transaction,
              paymentStatus: invoice.status,
              paymentType: 'refund',
              amount: (invoice.amount_refunded / 100),
              paymentDate: new Date().getTime()
            };
            return new PaymentHistory().insert(dataHistory).then(savedHistory => {
              return res.json(new APIResponse({ status: 'OK', msg: 'Refunded amount to client account' }));
            });
          } else {
            return res.json(new APIResponse({ status: 'OK', msg: 'Different even type needed === Do not anything' }));
          }
        }).catch(e => next(e));
    }).catch((err) => {
      return res.json(new APIResponse({ status: 'FAILED', msg: 'Event not found' }));
    });
  }).catch((err) => {
    return res.json(new APIResponse({ status: 'FAILED', msg: 'Can not get Options' }));
  });
};

export const checkToShowBannerDiscount = (req, res, next) => {
  return new OptionModel().getPairs(1).then((dataResp) => {
    var isDisabled = parseInt(dataResp.o_allow_discount) === 1 ? true : false,
      limit = dataResp.o_discount_limit || 0,
      remaining_discount_subscription = dataResp.o_remaining_discount_subscription || 0,
      discount = dataResp.o_discount_percent || 0;

    if (!isDisabled || remaining_discount_subscription <= 0) {
      return res.json(new APIResponse({ showBanner: 0, discount: 0, limit: 0 }));
    } else {
      return res.json(new APIResponse({ showBanner: 1, discount: discount, limit: limit }));
    }
  }).catch((err) => {
    return res.json(new APIResponse({ status: 'FAILED', msg: 'Can not get Options' }));
  });
};

export const cronUpdateSubscriptionStatus = (req) => {
  const uModel = new UserModel();
  var now = new Date().getTime();
  return new SubscriptionModel()
    .select('t1.*, t2."firstName", t2."lastName", t2."email"')
    .where('t1."expiryDate" < $1 AND t1.status != $2')
    .join(`${uModel.getTable()} AS t2`, 't1."parentId"=t2."_id"', 'left outer') // eslint-disable-line
    .findAll([now, 'cancelled'])
    .then((subscriptions) => {
      for (var i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        if (subscription.status === 'active') {
          new SubscriptionModel().reset().where('t1._id::varchar=$1').update({ status: 'overdue' }, [subscription._id]);
        } else {
          if (subscription.channel === 'bank') {
            Utils.sendMail({
              to: subscription.email,
              template: 'mail_bank_transfer_cancellation',
              data: {
                firstName: subscription.firstName,
                lastName: subscription.lastName
              }
            });
          }
          new SubscriptionModel().reset().where('t1._id::varchar=$1').update({ status: 'cancelled' }, [subscription._id]);
        }
      }
      return;
    }).catch(e => {
      return;
    });

}

export const cancelSubscription = (req, res, next) => {
  const authData = authCtrl.getJwtInfo(req);
  return new OptionModel().getPairs().then((dataResp) => {
    return new UserModel().where('t1._id::varchar=$1').findOne([authData.userId]).then((user) => {
      if (user === null) {
        return res.json(new APIResponse({ status: 'ERR', msg: 'UNREGISTERED_USER' }));
      }
      if (user.hashedPassword !== Utils.encrypt(req.body.password, user.salt)) {
        return res.json(new APIResponse({ status: 'ERR', msg: 'WRONG_PASSWORD' }));
      }

      return new SubscriptionModel().where('t1._id::varchar=$1').findOne([req.body.subscriptionId]).then((subscription) => {
        if (subscription === null) {
          return res.json(new APIResponse({ status: 'ERR', msg: 'SUBSCRIPTION_NOT_FOUND' }));
        }

        var refundCharge = false,
          monthsUsed = 1;
        const dataUpdate = {
          cancelMetadata: req.body.cancellationData
        }
        if (subscription.status === 'trialing') {
          dataUpdate.status = 'cancelled';
        } else if (subscription.status === 'active') {
          var date = new Date(),
            lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0),
            tsLastDayOfMonth = moment(lastDayOfMonth).unix() * 1000,
            periodStart = moment(moment.unix(subscription.expiryDateFrom / 1000).format('YYYY-MM-DD')),
            periodEnd = moment(moment.unix(tsLastDayOfMonth / 1000).format('YYYY-MM-DD'));
          dataUpdate.expiryDate = tsLastDayOfMonth;
          if (subscription.channel === 'stripe' && subscription.expirationType == 'annually') {
            refundCharge = true;
            monthsUsed = periodEnd.diff(periodStart, 'months') + 1;
          }
        }
        return new SubscriptionModel().reset().where('t1._id::varchar=$1').update(dataUpdate, [req.body.subscriptionId]).then(result => {
          if (result === null) {
            return res.json(new APIResponse({ status: 'ERR', msg: 'UPDATE_FAILED' }));
          }

          if (subscription.status === 'trialing') {
            Utils.sendMail({
              to: user.email,
              template: 'mail_sorry_for_cancellation',
              data: {
                firstName: user.firstName,
                lastName: user.lastName,
                signUpLink: dataResp.o_website_url + '/subscribe'
              }
            });
          }

          if (req.body.stripeSubscriptionId !== null) {
            var stripe = require("stripe")(dataResp.o_stripe_secret);
            stripe.subscriptions.del(req.body.stripeSubscriptionId,
              function (err, confirmation) {
                var amountRefund = (subscription.fee * 12) - (monthsUsed * subscription.fee) - dataResp.o_admin_fee;
                if (refundCharge && amountRefund > 0 && subscription.stripeChargeId !== '') {
                  stripe.charges.refund(subscription.stripeChargeId,
                    {
                      amount: amountRefund * 100
                    }, function (err, refund) {
                      // asynchronously called
                    });
                }
                if (subscription.status !== 'trialing') {
                  if (result.channel === 'annually') {
                    Utils.sendMail({
                      to: user.email,
                      template: 'mail_cancel_annually_subscription',
                      data: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        signUpLink: dataResp.o_website_url + '/subscribe'
                      }
                    });
                  } else {
                    Utils.sendMail({
                      to: user.email,
                      template: 'mail_cancel_monthly_subscription',
                      data: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        signUpLink: dataResp.o_website_url + '/subscribe'
                      }
                    });
                  }
                }
                return res.json(new APIResponse({ status: 'OK', msg: 'UPDATE_SUCCESSFUL' }));
              }
            );
          }
          return res.json(new APIResponse({ status: 'OK', msg: 'UPDATE_SUCCESSFUL' }));
        }).catch(e => next(e));
      }).catch(e => next(e));
    }).catch(e => next(e));
  }).catch(e => next(e));
};


export const getOptions = (req, res, next) => {
  return new OptionModel().getPairs(1, true).then((dataResp) => {
    return res.json(new APIResponse(dataResp))
  }).catch(e => next(e));
}

export const forgotPassword = (req, res, next) => {
  return new OptionModel().getPairs().then((dataResp) => {
    return new UserModel().where('lower(t1.email)=$1').findOne([req.body.email]).then((user) => {
      if (user === null) {
        return res.json(new APIResponse({ status: 'ERR', msg: 'EMAIL_NOT_EXISTS' }));
      }

      Utils.sendMail({
        to: user.email,
        template: 'mail_forgot_password',
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          resetPasswordUrl: dataResp.o_website_url + '/resetPassword/' + user._id + "/" + Utils.sha3Encrypt(user._id + user.dateCreated)
        }
      }).then(result => {
        return res.json(new APIResponse({ status: 'OK', msg: 'EMAIL_SENT' }));
      }).catch(err => {
        return res.json(new APIResponse({ status: 'ERR', msg: 'EMAIL_NOT_SENT' }));
      });

    }).catch(e => next(e));
  }).catch(e => next(e));
};

export const getUserForgotPassword = (req, res, next) => {
  var _id = req.params.id,
    hash = req.params.hash;
  return new UserModel().where('t1._id::varchar=$1').findOne([_id]).then((user) => {
    if (user === null) {
      return res.json(new APIResponse({ status: 'ERR', msg: 'USER_NOT_FOUND' }));
    }

    if (hash !== Utils.sha3Encrypt(user._id + user.dateCreated)) {
      return res.json(new APIResponse({ status: 'ERR', msg: 'HASH_DID_NOT_MATCH' }));
    }

    return res.json(new APIResponse({ status: 'OK', msg: 'HASH_MATCH' }));
  }).catch(e => next(e));
};

export const resetPassword = (req, res, next) => {
  return new UserModel().where('t1._id::varchar=$1').findOne([req.body.id]).then((user) => {
    if (user === null) {
      return res.json(new APIResponse({ status: 'ERR', msg: 'USER_NOT_EXISTS' }));
    }

    var hashedPassword = Utils.encrypt(req.body.password, user.salt);
    return new UserModel().reset().where('t1._id::varchar=$1').update({ hashedPassword: hashedPassword }, [user._id]).then(dataUpdated => {
      if (!dataUpdated) return res.json(new APIResponse({ status: 'ERR', msg: 'PASSWORD_WAS_NOT_RESET' }));
      Utils.sendMail({
        to: user.email,
        template: 'mail_reset_password_inform',
        data: {
          firstName: user.firstName,
          lastName: user.lastName
        }
      }).then(result => {
        return res.json(new APIResponse({ status: 'OK', msg: 'PASSWORD_WAS_RESET_AND_EMAIL_SENT' }));
      }).catch(err => {
        return res.json(new APIResponse({ status: 'OK', msg: 'PASSWORD_WAS_RESET_AND_EMAIL_NOT_SENT' }));
      });
    });

  }).catch(e => next(e));
};

export const getSubscriptions = (req, res, next) => {
  try {
    let { name, email, status, refid, planId, createdDateFrom, createdDateTo, nextPaymentDateFrom, nextPaymentDateTo } = req.body;

    console.log('#@#@#@#@#@#@#@#@#@=> req.body: ', req.body);

    const sModel = new SubscriptionModel();
    const iModel = new ItemModel();
    const pModel = new PlanModel();
    const cModel = new CourseModel();
    const uModel = new UserModel();

    sModel.join(`${uModel.getTable()} AS t6`, 't6._id::varchar=t1."parentId"::varchar', 'LEFT')

    if (email) {
      sModel.where(`lower(t6.email) LIKE '%${email.toLowerCase()}%'`);
    }

    if (name) {
      sModel.where(`lower(t6."firstName") LIKE '%${name.toLowerCase()}%' OR lower(t6."lastName") LIKE '%${name.toLowerCase()}%'`);
    }

    if (refid) {
      sModel.where(`t1.refid = '${refid}'`);
    }

    if (status) {
      sModel.where(`lower(t1.status) = '${status.toLowerCase()}'`);
    }

    if (planId) {
      sModel.where(`t1."planId"::varchar = '${planId}'`);
    }

    if (createdDateFrom && createdDateTo) {
      if (createdDateFrom > createdDateTo) {
        let tmpTs = createdDateFrom;
        createdDateFrom = createdDateTo;
        createdDateTo = tmpTs;
      }
      sModel.where(`t1."dateCreated" BETWEEN ${createdDateFrom} AND ${createdDateTo}`);
    }

    if (nextPaymentDateFrom && nextPaymentDateTo) {
      if (nextPaymentDateFrom > nextPaymentDateTo) {
        let tmpTs = nextPaymentDateFrom;
        nextPaymentDateFrom = nextPaymentDateTo;
        nextPaymentDateTo = tmpTs;
      }
      sModel.where(`t1."expiryDate" BETWEEN ${nextPaymentDateFrom} AND ${nextPaymentDateTo}`);
    }

    return sModel.findCount().then((total) => {
      let limit = 15,
        pages = Math.ceil(total / limit);
      let { page = 1 } = req.body;
      let offset = (parseInt(page) - 1) * limit;
      if (page > pages) {
        page = pages;
      }

      sModel
        .select(`t1."_id", t1."parentId", t1."planId", t1."expirationType", t1."type", t1.refid,
        t1."expiryDate", t1.discount, t1.fee, t1.status, t1."dateCreated", t1.channel, t1."cardId", t1."nextPeriodStart", t1."nextPeriodEnd", t1."nextChannel", t1."nextExpirationType", t1."cancelMetadata",  
        ARRAY(SELECT t2.title FROM ${cModel.getTable()} AS t2 
          INNER JOIN ${pModel.getTable()} AS t3 ON t2._id = ANY(ARRAY[t3."courseIds"])
          WHERE t3._id=t1."planId") AS "courseTitles", (SELECT t4.user FROM ${iModel.getTable()} AS t4 WHERE t4.order=t1._id Limit 1) AS "studentId",
          t6."firstName", t6."lastName", t6.email, t6.username`)
        .orderBy('t1."dateCreated" DESC')
        .limit(limit).offset(offset)
        .findAll()
        .then((subscriptions) => {
          const result = {
            subscriptions,
            page,
            totalPages: pages
          };
          return res.json(new APIResponse(result));
        })
        .catch(e => next(e));
    }).catch(e => next(e));
  }
  catch (ex) {
    return next(ex);
  }
};

export const cronSendTrialReminderEmail = (req) => {
  const uModel = new UserModel();

  return new OptionModel().getPairs().then((dataResp) => {
    return new SubscriptionModel()
      .select('t1.*, t2."firstName", t2."lastName", t2."email"')
      .where('t1.status = $1')
      .join(`${uModel.getTable()} AS t2`, 't1."parentId"=t2."_id"', 'left outer') // eslint-disable-line
      .findAll(['trialing'])
      .then((subscriptions) => {
        if (subscriptions.length > 0) {
          for (var i = 0; i < subscriptions.length; i++) {
            const subscription = subscriptions[i];
            var expiryDate = moment(moment.unix(subscription.expiryDate / 1000).format('YYYY-MM-DD')),
              expiryDateFrom = moment(moment.unix(subscription.expiryDateFrom / 1000).format('YYYY-MM-DD')),
              fee = subscription.fee,
              isSendEmail = false,
              emailTemplate = '';
            if (subscription.expirationType === 'annually') {
              fee = fee * 12;
            }
            if (expiryDate.diff(expiryDateFrom, 'days') === 7) {
              emailTemplate = 'mail_trial_reminder_after_7_days';
              isSendEmail = true;
            } else if (expiryDate.diff(expiryDateFrom, 'days') === 2) {
              emailTemplate = 'mail_trial_reminder_after_12_days';
              isSendEmail = true;
            } else if (expiryDate.diff(expiryDateFrom, 'days') === 1) {
              emailTemplate = 'mail_trial_reminder_after_13_days';
              isSendEmail = true;
            } else if (expiryDate.diff(expiryDateFrom, 'days') < 1) {
              emailTemplate = 'mail_trial_reminder_when_expired';
              isSendEmail = true;
            }

            if (isSendEmail) {
              Utils.sendMail({
                to: subscription.email,
                template: emailTemplate,
                data: {
                  email: subscription.email,
                  firstName: subscription.firstName,
                  lastName: subscription.lastName,
                  price: '$' + fee,
                  type: subscription.expirationType,
                  subscriptionDetailsLink: dataResp.o_website_url + '/subscription-details/' + subscription._id,
                }
              });
            }
          }
        }
      })
      .catch(e => next(e));
  }).catch(e => next(e));
}

export default { getSubscriptionsByUser, create, assignStudent, upgrade, countSubscriptions, getSubscriptionById, paySubscription, stripeConfirmation, checkToShowBannerDiscount, cancelSubscription, getOptions, forgotPassword, getUserForgotPassword, resetPassword };
