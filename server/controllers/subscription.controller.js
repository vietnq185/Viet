'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSubscriptionById = exports.countSubscriptions = exports.getSubscriptionsByUser = exports.UpdateCardIdForSubscription = exports.assignStudent = exports.create = undefined;

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _auth = require('./auth.controller');

var authCtrl = _interopRequireWildcard(_auth);

var _subscription = require('../models/subscription.model');

var _subscription2 = _interopRequireDefault(_subscription);

var _cclist = require('../models/cclist.model');

var _cclist2 = _interopRequireDefault(_cclist);

var _plan = require('../models/plan.model');

var _plan2 = _interopRequireDefault(_plan);

var _item = require('../models/item.model');

var _item2 = _interopRequireDefault(_item);

var _course = require('../models/course.model');

var _course2 = _interopRequireDefault(_course);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _APIResponse = require('../helpers/APIResponse');

var _APIResponse2 = _interopRequireDefault(_APIResponse);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _Utils = require('../helpers/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _constants = require('../../config/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('rest-api:subscription.controller'); // eslint-disable-line


/**
 * Create new subscription
 * @property {string} req.body.parentId
 * @property {string} req.body.planId
 * @property {string} req.body.expirationType
 * @property {string} req.body.type
 * @returns {SubscriptionModel}
 */
var create = exports.create = function create(req, res, next) {
  //
  var id = _Utils2.default.uuid();
  var parentId = req.body.parentId || '';
  var planId = req.body.planId || '';
  var expirationType = req.body.expirationType || '';
  var type = req.body.type || '';
  var studentId = req.body.studentId || '';
  var channel = req.body.channel || '';
  var cardId = req.body.cardId || '';
  var discount = req.body.discount || 0;
  // validate parent
  var validateParent = new _user2.default().where('t1._id=$1').findCount([parentId]).then(function (cnt) {
    var err = new _APIError2.default(_constants2.default.errors.parentNotFound, _httpStatus2.default.OK, true);
    return cnt > 0 ? Promise.resolve() : Promise.reject(err);
  });

  // validate plan
  var validatePlan = new _plan2.default().where('t1._id=$1').findCount([planId]).then(function (cnt) {
    var err = new _APIError2.default(_constants2.default.errors.planNotFound, _httpStatus2.default.OK, true);
    return cnt > 0 ? Promise.resolve() : Promise.reject(err);
  });
  //
  var promises = [validateParent, validatePlan];
  //
  Promise.all(promises).then(function (results) {
    // eslint-disable-line
    return new _plan2.default().getPlanById(planId).then(function (planData) {
      if (planData === null) {
        return Promise.reject(new _APIError2.default(_constants2.default.errors.planNotFound, _httpStatus2.default.OK, true));
      }
      return Promise.resolve(planData);
    });
  }).then(function (planData) {
    return new _subscription2.default().findCount().then(function (totalSubscriptions) {
      var discountValue = 0,
          fee = planData.fee;
      if (parseFloat(discount) > 0 && totalSubscriptions <= 200) {
        discountValue = fee * discount / 100;
      }
      fee = fee - discountValue;

      // create data
      var data = { // eslint-disable-line
        _id: id,
        parentId: parentId,
        planId: planId,
        expirationType: expirationType,
        type: type,
        dateCreated: new Date().getTime(),
        dateModified: new Date().getTime(),
        expiryDateFrom: new Date().getTime(),
        expiryDate: new Date().getTime() + 14 * 86400 * 1000, //14 days trial
        channel: channel,
        fee: fee,
        discount: discountValue,
        status: 'trailing'
      };
      if (cardId !== '') {
        data.cardId = cardId;
      }
      if (expirationType == 'annually') {
        data.frequency = 'monthly';
      } else {
        data.frequency = 'yearly';
      }
      // insert
      return new _subscription2.default().insert(data).then(function (savedSubscription) {
        if (savedSubscription === null) {
          return Promise.reject(new _APIError2.default(_constants2.default.errors.createSubscriptionError, _httpStatus2.default.OK, true));
        }
        return Promise.resolve(savedSubscription);
      }).then(function (savedSubscription) {
        if (channel == 'bank' && typeof req.body.addCard !== 'undefined') {
          var cardData = {
            _id: _Utils2.default.uuid(),
            userId: parentId,
            name: _Utils2.default.aesEncrypt(req.body.card_name, _constants2.default.ccSecret),
            ccnum: _Utils2.default.aesEncrypt(req.body.ccnum, _constants2.default.ccSecret),
            ccmonth: _Utils2.default.aesEncrypt(req.body.ccmonth, _constants2.default.ccSecret),
            ccyear: _Utils2.default.aesEncrypt(req.body.ccyear, _constants2.default.ccSecret),
            cvv: _Utils2.default.aesEncrypt(req.body.cvv, _constants2.default.ccSecret),
            dateCreated: new Date().getTime()
          };
          var savedCard = new _cclist2.default().insert(cardData).then(savedCard);
          if (savedCard !== null) {
            new _subscription2.default().where('t1._id::varchar=$1').update({ cardId: cardData._id }, [savedSubscription._id]);
          }
        }
        var planItems = [];
        for (var i = 0; i < planData.courseIds.length; i++) {
          var dataItem = {
            _id: _Utils2.default.uuid(),
            creator: parentId,
            dateCreated: new Date().getTime(),
            dateModified: new Date().getTime(),
            order: savedSubscription._id,
            course: planData.courseIds[i]
          };
          if (studentId != '') {
            dataItem.user = studentId;
          }
          var savedItem = new _item2.default().insert(dataItem).then(savedItem);
          planItems[i] = dataItem;
        }
        savedSubscription.planItems = planItems;
        return Promise.resolve(savedSubscription);
      }).then(function (savedSubscription) {
        return res.json(new _APIResponse2.default(_subscription2.default.extractData(savedSubscription)));
      }).catch(function (e) {
        return next(e);
      }); // eslint-disable-line;
    });
  }).catch(function (e) {
    return next(e);
  }); // eslint-disable-line
  //
};

var assignStudent = exports.assignStudent = function assignStudent(req, res, next) {
  var subscriptionId = req.body.subscriptionId || '';
  var studentId = req.body.studentId || '';

  // validate subscription
  var validateSubscription = new _subscription2.default().where('t1._id=$1').findCount([subscriptionId]).then(function (cnt) {
    var err = new _APIError2.default(_constants2.default.errors.subscriptionNotFound, _httpStatus2.default.OK, true);
    return cnt > 0 ? Promise.resolve() : Promise.reject(err);
  });

  // validate student
  var validateStudent = new _user2.default().where('t1._id=$1').findCount([studentId]).then(function (cnt) {
    var err = new _APIError2.default(_constants2.default.errors.studentNotFound, _httpStatus2.default.OK, true);
    return cnt > 0 ? Promise.resolve() : Promise.reject(err);
  });
  //
  var promises = [validateSubscription, validateStudent];

  Promise.all(promises).then(function (results) {
    // eslint-disable-line
    promises.push(new _item2.default().where('t1.order::varchar=$1').update({ user: studentId }, [subscriptionId]));
    return res.json(new _APIResponse2.default("Assigned student")); // eslint-disable-line
  }).catch(function (e) {
    return next(e);
  });
};

var UpdateCardIdForSubscription = exports.UpdateCardIdForSubscription = function UpdateCardIdForSubscription(req, res, next) {
  var subscriptionId = req.body.subscriptionId || '';
  var cardId = req.body.cardId || '';

  // validate subscription
  var validateSubscription = new _subscription2.default().where('t1._id=$1').findCount([subscriptionId]).then(function (cnt) {
    var err = new _APIError2.default(_constants2.default.errors.subscriptionNotFound, _httpStatus2.default.OK, true);
    return cnt > 0 ? Promise.resolve() : Promise.reject(err);
  });

  // validate card
  var validateCard = new _cclist2.default().where('t1._id=$1').findCount([cardId]).then(function (cnt) {
    var err = new _APIError2.default(_constants2.default.errors.cardNotFound, _httpStatus2.default.OK, true);
    return cnt > 0 ? Promise.resolve() : Promise.reject(err);
  });
  //
  var promises = [validateSubscription, validateCard];

  Promise.all(promises).then(function (results) {
    // eslint-disable-line
    promises.push(new _subscription2.default().where('t1._id::varchar=$1').update({ cardId: cardId }, [subscriptionId]));
    return res.json(new _APIResponse2.default("Card has been updated for subscription")); // eslint-disable-line
  }).catch(function (e) {
    return next(e);
  });
};

/**
 * Get subscriptions list.
 * @property {number} req.query.limit - Limit number of subscriptions to be returned.
 * @property {number} req.query.offset - Position to fetch data.
 * @property {userId} - Get data by user.
 * @returns {SubscriptionModel[]}
 */
var getSubscriptionsByUser = exports.getSubscriptionsByUser = function getSubscriptionsByUser(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 10 : _req$query$limit,
      _req$query$offset = _req$query.offset,
      offset = _req$query$offset === undefined ? 0 : _req$query$offset;

  return new _subscription2.default().where('t1."parentId"::varchar=$1').findCount([req.params.userId]).then(function (total) {
    var rowCount = 10,
        pages = Math.ceil(total / rowCount),
        page = 1;
    if (req.params.page != undefined && parseInt(req.params.page) > 0) {
      page = parseInt(req.params.page);
    }
    var offset = (parseInt(page) - 1) * rowCount;
    if (page > pages) {
      page = pages;
    }

    var iModel = new _item2.default();
    var pModel = new _plan2.default();
    var cModel = new _course2.default();
    new _subscription2.default().where('t1."parentId"::varchar=$1').select('t1."_id", t1."parentId", t1."planId", t1."expirationType", t1."type", \n        t1."expiryDate", t1.discount, t1.fee, t1.status, t1."dateCreated", t1.channel, t1."cardId", \n        ARRAY(SELECT t2.title FROM ' + cModel.getTable() + ' AS t2 \n          INNER JOIN ' + pModel.getTable() + ' AS t3 ON t2._id = ANY(ARRAY[t3."courseIds"])\n          WHERE t3._id=t1."planId") AS "courseTitles", (SELECT t4.user FROM ' + iModel.getTable() + ' AS t4 WHERE t4.order=t1._id Limit 1) AS "studentId"').orderBy('t1."dateCreated" DESC').limit(limit).offset(offset).findAll([req.params.userId]).then(function (subscriptions) {
      var result = {
        subscriptions: subscriptions,
        page: page,
        totalPages: pages
      };
      return res.json(new _APIResponse2.default(result));
    }).catch(function (e) {
      return next(e);
    });
  });
};

var countSubscriptions = exports.countSubscriptions = function countSubscriptions(req, res, next) {
  return new _subscription2.default().findCount().then(function (total) {
    return res.json(new _APIResponse2.default(total));
  }).catch(function (e) {
    return next(e);
  });
};

var getSubscriptionById = exports.getSubscriptionById = function getSubscriptionById(req, res, next) {
  var cModel = new _course2.default();
  var pModel = new _plan2.default();
  var ccModel = new _cclist2.default();
  var uModel = new _user2.default();
  var iModel = new _item2.default();
  return new _subscription2.default().select('t1.*,\n      ARRAY(SELECT t2.title FROM ' + cModel.getTable() + ' AS t2 \n            INNER JOIN ' + pModel.getTable() + ' AS t3 ON t2._id = ANY(ARRAY[t3."courseIds"])\n            WHERE t3._id=t1."planId") AS "courseTitles", t4.name, t4.ccnum, t4.ccmonth, t4.ccyear, t4.cvv,\n      (SELECT t5.user FROM ' + iModel.getTable() + ' AS t5 WHERE t5.order=t1._id Limit 1) AS "studentId"\n    ').join(ccModel.getTable() + ' AS t4', 't1."cardId"::varchar=t4."_id"::varchar', 'left') // eslint-disable-line
  .where('t1._id::varchar=$1').findOne([req.params.subscriptionId]).then(function (subscription) {
    // eslint-disable-line
    if (subscription !== null) {
      var flist = ['name', 'ccnum', 'ccmonth', 'ccyear', 'cvv'];
      try {
        for (var j = 0; j < flist.length; j++) {
          // eslint-disable-line
          var fn = flist[j];
          subscription[fn] = _Utils2.default.aesDecrypt(subscription[fn], _constants2.default.ccSecret); // eslint-disable-line
          if (fn === 'ccnum') {
            subscription[fn] = (subscription[fn] + '').replace(/.(?=.{4,}$)/g, "*"); // eslint-disable-line
          }
        }
      } catch (ex) {} // eslint-disable-line
      subscription.items = []; // eslint-disable-line
      return new _item2.default().select('t1.*, t2."firstName", t2."lastName", t2."email", t2."metadata" AS "studentInfo"').where('t1.order=$1').join(uModel.getTable() + ' AS t2', 't1."user"=t2."_id"', 'left outer') // eslint-disable-line
      .findAll([subscription._id]).then(function (items) {
        subscription.items = items; // eslint-disable-line
        return res.json(new _APIResponse2.default(subscription));
      }).catch(function (e) {
        return next(e);
      });
    }
    return res.json(new _APIResponse2.default({ msg: _constants2.default.errors.subscriptionNotFound }));
  }).catch(function (e) {
    return next(e);
  });
};

exports.default = { getSubscriptionsByUser: getSubscriptionsByUser, create: create, assignStudent: assignStudent, UpdateCardIdForSubscription: UpdateCardIdForSubscription, countSubscriptions: countSubscriptions, getSubscriptionById: getSubscriptionById };
//# sourceMappingURL=subscription.controller.js.map
