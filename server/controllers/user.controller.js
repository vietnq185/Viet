'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cclist = exports.remove = exports.list = exports.update = exports.create = exports.get = exports.load = undefined;

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _auth = require('./auth.controller');

var authCtrl = _interopRequireWildcard(_auth);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _userRole = require('../models/user.role.model');

var _userRole2 = _interopRequireDefault(_userRole);

var _cclist = require('../models/cclist.model');

var _cclist2 = _interopRequireDefault(_cclist);

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

var debug = require('debug')('rest-api:user.controller'); // eslint-disable-line

/**
 * Load user and append to req.
 */
var load = exports.load = function load(req, res, next, id) {
  authCtrl.verifyAccessToken(req, res, function (err) {
    if (err) {
      return next(err);
    }
    return new _user2.default().where('t1._id::varchar=$1').findOne([id]).then(function (user) {
      // not found
      if (user === null) {
        return next(new _APIError2.default('No such user exists!', _httpStatus2.default.NOT_FOUND));
      }
      // found
      // delete password
      delete user.hashedPassword; // eslint-disable-line

      var finalResp = function finalResp() {
        req.user = user; // eslint-disable-line no-param-reassign
        return next();
      };
      // find linked students (if any)
      var uModel = new _user2.default();
      var urModel = new _userRole2.default();
      urModel.reset().where('t1."user"::varchar=$1').findAll([user._id]).then(function (urResults) {
        //
        urModel.reset().select('t1._id AS "userRoleId", t2.*').join(uModel.getTable() + ' AS t2', 't1."targetRef"::varchar=t2."_id"::varchar') // eslint-disable-line
        .where('t1."user"::varchar=$1').getDataPair([user._id], ['userRoleId']).then(function (linkedStudents) {
          // eslint-disable-line
          var lsResults = [];
          for (var i = 0; i < urResults.length; i++) {
            // eslint-disable-line
            var urid = urResults[i]._id;
            var ls = _user2.default.extractData(linkedStudents[urid]);
            delete ls.userRoleId;
            urResults[i].targetUserInfo = ls; // eslint-disable-line
            lsResults.push(urResults[i]);
          }
          user.roles = lsResults; // eslint-disable-line
          return finalResp();
        }).catch(function (e) {
          // eslint-disable-line
          debug('get linked students error: ', e);
          return finalResp();
        });
        //
      }).catch(function (e) {
        return finalResp();
      }); // eslint-disable-line
      //
    }).catch(function (e) {
      return next(e);
    }); // eslint-disable-line
  });
};

/**
 * Get user
 * @returns {UserModel}
 */
var get = exports.get = function get(req, res, next) {
  var jwtInfo = authCtrl.getJwtInfo(req);
  if (authCtrl.isUser(req) && jwtInfo.userId !== req.user._id) {
    return next(new _APIError2.default('Forbidden', _httpStatus2.default.FORBIDDEN, true));
  }
  return res.json(new _APIResponse2.default(_user2.default.extractData(req.user)));
};

/**
 * Create new user
 * @property {string} req.body.email
 * @property {string} req.body.password
 * @property {string} req.body.firstName
 * @property {string} req.body.lastName
 * @returns {UserModel}
 */
var create = exports.create = function create(req, res, next) {
  //
  var id = _Utils2.default.uuid();
  var email = req.body.email;
  var username = req.body.username || id;
  // validate email
  var validateEmail = new _user2.default().where('t1.email=$1').findCount([email]).then(function (cnt) {
    var err = new _APIError2.default(_constants2.default.errors.emailRegisted, _httpStatus2.default.OK, true);
    return cnt === 0 ? Promise.resolve() : Promise.reject(err);
  });
  // validate username
  var validateUsername = new _user2.default().where('t1.username=$1').findCount([username]).then(function (cnt) {
    var err = new _APIError2.default(_constants2.default.errors.usernameRegisted, _httpStatus2.default.OK, true);
    return cnt === 0 ? Promise.resolve() : Promise.reject(err);
  });
  //
  var promises = [validateEmail, validateUsername];
  // validate parent (if any)
  var reqStatus = req.body.status || [];
  if (typeof req.body.parentId !== 'undefined' && _Utils2.default.isNotEmptyArray(reqStatus) && (reqStatus.indexOf('student') !== -1 || reqStatus.indexOf('STUDENT') !== -1)) {
    var validateParent = new _user2.default().where('t1._id::varchar=$1').findOne([req.body.parentId]).then(function (parentData) {
      var err = new _APIError2.default(_constants2.default.errors.wrongUsername, _httpStatus2.default.OK, true);
      return parentData === null ? Promise.reject(err) : Promise.resolve(parentData);
    });
    promises.push(validateParent);
  }
  //
  Promise.all(promises).then(function (results) {
    // eslint-disable-line
    // create data
    var salt = _Utils2.default.getSalt();
    var data = { // eslint-disable-line
      _id: id,
      username: username,
      email: email,
      phone: req.body.phone || '',
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      salt: salt,
      hashedPassword: _Utils2.default.encrypt(req.body.password, salt),
      provider: 'local',
      dateCreated: new Date().getTime(),
      role: req.body.role || 'user'
    };
    if (_Utils2.default.isNotEmptyObject(req.body.metadata || {})) {
      data.metadata = req.body.metadata;
    }
    if (_Utils2.default.isNotEmptyArray(req.body.status || [])) {
      data.status = req.body.status;
    }
    // insert
    return new _user2.default().insert(data).then(function (savedUser) {
      if (savedUser === null) {
        return Promise.reject(new _APIError2.default(_constants2.default.errors.registerError, _httpStatus2.default.OK, true));
      }
      if (results.length === 2) {
        return Promise.resolve(savedUser);
      }
      // in this case, now the savedUser is student, then insert to user_roles
      var parentUserData = results[2];
      var userRoleData = {
        _id: _Utils2.default.uuid(),
        user: parentUserData._id,
        role: 'guardian',
        targetModel: 'user',
        targetRef: savedUser._id
      };
      return new _userRole2.default().insert(userRoleData).then(function (savedUserRole) {
        return Promise.resolve(savedUser);
      }).catch(function (e) {
        // eslint-disable-line
        debug('insert student into user_roles error: ', e);
        return Promise.resolve(savedUser);
      }); // eslint-disable-line
    });
  }).then(function (savedUser) {
    return res.json(new _APIResponse2.default(_user2.default.extractData(savedUser)));
  }).catch(function (e) {
    return next(e);
  }); // eslint-disable-line
  //
};

/**
 * Update existing user
 * @property {string} req.body.email // optional
 * @property {string} req.body.password // optional
 * @property {string} req.body.phone // optional
 * @property {string} req.body.firstName // optional
 * @property {string} req.body.lastName // optional
 * @returns {UserModel}
 */
var update = exports.update = function update(req, res, next) {
  var jwtInfo = authCtrl.getJwtInfo(req);
  if (authCtrl.isUser(req) && jwtInfo.userId !== req.user._id) {
    return next(new _APIError2.default('Forbidden', _httpStatus2.default.FORBIDDEN, true));
  }

  var promises = [];
  var userData = _Utils2.default.copy(req.user);

  // validate email (if any)
  if (typeof req.body.email !== 'undefined') {
    var validateEmail = new _user2.default().where('t1._id::varchar!=$1 AND t1.email=$2').findCount([userData._id, req.body.email]).then(function (cnt) {
      var err = new _APIError2.default(_constants2.default.errors.emailRegisted, _httpStatus2.default.OK, true);
      return cnt === 0 ? Promise.resolve() : Promise.reject(err);
    });
    promises.push(validateEmail);
  }

  // update data
  var optionalParams = ['email', 'phone', 'firstName', 'lastName'];
  for (var i = 0; i < optionalParams.length; i++) {
    // eslint-disable-line
    var param = optionalParams[i];
    if (typeof req.body[param] !== 'undefined') {
      userData[param] = req.body[param];
    }
  }
  // encrypt password (if any)
  if (typeof req.body.password !== 'undefined') {
    userData.hashedPassword = _Utils2.default.encrypt(req.body.password, userData.salt);
  }
  //
  promises.push(new _user2.default().where('t1._id::varchar=$1').update(userData, [userData._id]));

  return Promise.all(promises).then(function (results) {
    var savedUser = promises.length === 2 ? results[1] : results[0];
    return res.json(new _APIResponse2.default(savedUser !== null ? _user2.default.extractData(savedUser[0]) : savedUser)); // eslint-disable-line
  }).catch(function (e) {
    return next(e);
  });
};

/**
 * Get user list.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @property {number} req.query.offset - Position to fetch data.
 * @returns {UserModel[]}
 */
var list = exports.list = function list(req, res, next) {
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 50 : _req$query$limit,
      _req$query$offset = _req$query.offset,
      offset = _req$query$offset === undefined ? 0 : _req$query$offset;

  new _user2.default().select('t1."_id", t1."firstName", t1."lastName", t1."email", t1."phone", t1."metadata", t1."status"').limit(limit).offset(offset).findAll().then(function (users) {
    return res.json(new _APIResponse2.default(users));
  }).catch(function (e) {
    return next(e);
  });
};

/**
 * Delete user.
 * @returns {UserModel}
 */
var remove = exports.remove = function remove(req, res, next) {
  var jwtInfo = authCtrl.getJwtInfo(req);
  if (authCtrl.isUser(req) && jwtInfo.userId !== req.user._id) {
    return next(new _APIError2.default('Forbidden', _httpStatus2.default.FORBIDDEN, true));
  }

  var userData = req.user;
  return new _user2.default().where('_id::varchar=$1').delete([userData._id]).then(function (deletedUser) {
    return res.json(new _APIResponse2.default(deletedUser !== null ? _user2.default.extractData(deletedUser[0]) : deletedUser));
  }) // eslint-disable-line
  .catch(function (e) {
    return next(e);
  });
};

/**
 * Get cc list of a specific user.
 * @returns {CCListModel[]}
 */
var cclist = exports.cclist = function cclist(req, res, next) {
  // eslint-disable-line
  new _cclist2.default().where('t1."userId"::varchar=$1').orderBy('"name" ASC').findAll([req.user._id]).then(function (cc) {
    var flist = ['name', 'ccnum', 'ccmonth', 'ccyear', 'cvv'];
    for (var i = 0; i < cc.length; i++) {
      // eslint-disable-line
      try {
        for (var j = 0; j < flist.length; j++) {
          // eslint-disable-line
          var fn = flist[j];
          cc[i][fn] = _Utils2.default.aesDecrypt(cc[i][fn], _constants2.default.ccSecret); // eslint-disable-line
          if (fn === 'ccnum') {
            cc[i][fn] = (cc[i][fn] + '').replace(/.(?=.{3,}$)/g, "*"); // eslint-disable-line
          }
        }
      } catch (ex) {} // eslint-disable-line
    }
    return res.json(new _APIResponse2.default(cc));
  }).catch(function (e) {
    return next(e);
  });
};

exports.default = { load: load, get: get, create: create, update: update, list: list, remove: remove, cclist: cclist };
//# sourceMappingURL=user.controller.js.map
