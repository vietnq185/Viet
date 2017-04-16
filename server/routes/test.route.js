'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _pgEscape = require('pg-escape');

var _pgEscape2 = _interopRequireDefault(_pgEscape);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _Utils = require('../helpers/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-disable*/

var router = _express2.default.Router(); // eslint-disable-line new-cap

// test
router.get('/', function (req, res, next) {
  return res.send('OK');

  /*const user = new UserModel();
  const values = ['%88%', 'Dung'];
  user.reset()
    .where('t1."firstName"=$2')
    .where("t1._id::varchar LIKE $1")
    .findOne(values)
    .then(r => res.send(r)).catch(e => next(e));*/

  /*const user = new UserModel();
  const values = ['%88%', 'Dung', 'user'];
  user.reset()
    .select('t2.title AS item_title, t1.*')
    .join('"items" AS t2', 't1._id = t2.user', 'LEFT OUTER')
    .where('t1."firstName"=$2')
    .where("t1._id::varchar LIKE $1")
    .groupBy('t1._id, t1."firstName", t2.title')
    .having('t1."role" = $3')
    .orderBy('t1."firstName"')
    .limit(10)
    .offset(1)
    .findAll(values)
    .then(r => res.send(r)).catch(e => next(e));*/

  // Test findCount with JOIN
  /*const user = new UserModel();
  const values = ['%88%', 'Dung', 'user'];
  user.reset()
    .select('t2.title AS item_title, t1.*')
    .join('"items" AS t2', 't1._id = t2.user', 'LEFT OUTER')
    .where('t1."firstName"=$2')
    .where("t1._id::varchar LIKE $1")
    .groupBy('t1._id, t1."firstName", t2.title')
    .having('t1."role" = $3')
    .orderBy('t1."firstName"')
    .limit(10)
    .offset(1)
    .findCount(values)
    .then(r => res.send(r)).catch(e => next(e));*/

  // Test findCount without JOIN
  /*const user = new UserModel();
  const values = ['%88%', 'Dung'];
  user.reset()
    .where('t1."firstName"=$2')
    .where("t1._id::varchar LIKE $1")
    .findCount(values)
    .then(r => res.send(r)).catch(e => next(e));*/

  /*const user = new UserModel();
  const values = ['%88%', 'Dung', 'user'];
  const keyFields = ['_id', 'dateCreated', 'item_title'];
  const valuesFields = ['_id', 'username', 'firstName', 'lastName'];
  user.reset()
    .select('t2.title AS item_title, t1.*')
    .join('"items" AS t2', 't1._id = t2.user', 'LEFT OUTER')
    .where('t1."firstName"=$2')
    .where("t1._id::varchar LIKE $1")
    .groupBy('t1._id, t1."firstName", t2.title')
    .having('t1."role" = $3')
    .orderBy('t1."firstName"')
    .limit(10)
    .offset(1)
    .getDataPair(values, keyFields, valuesFields)
    .then(r => res.send(r)).catch(e => next(e));*/

  // insert one object
  /*const user = new UserModel();
  user.insert({ _id: ('4089688e-cdba-4ad1-8b84-d7' + parseInt(new Date().getTime() / 1000)), firstName: "--NGOC''injection", lastName: 'DAM', phone: '0909091101' })
    .then(r => res.send(r))
    .catch(e => next(e));*/

  // Insert array of object
  /*const user = new UserModel();
  var data = [];
  for (var i = 0; i < 10; i++) {
    data.push({
      _id: Utils.uuid(),
      firstName: "--NGOC''injection",
      lastName: 'DAM',
      phone: '0909091101'
    });
  }
  user.insert(data)
    .then(r => res.send(r))
    .catch(e => next(e));*/

  /*const user = new UserModel();
  const updateData = { firstName: "--NGOC''injection updated" + new Date().getTime(), lastName: 'DAM updated', phone: '0909091101' };
  const values = ['%NGOC%'];
  user
    .where('t1."firstName" LIKE $1')
    .update(updateData, values)
    .then(r => res.send(r))
    .catch(e => next(e));*/

  /*const user = new UserModel();
  const values = ['05648f66-b9cb-48ab-bd92-de5b59392dbd'];
  user.where("_id=$1")
    .delete(values)
    .then(r => res.send(r))
    .catch(e => next(e));*/
});

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=test.route.js.map
