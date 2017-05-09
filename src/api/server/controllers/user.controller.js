import httpStatus from 'http-status';

import * as authCtrl from './auth.controller';
import UserModel from '../models/user.model';
import UserRoleModel from '../models/user.role.model';
import CCListModel from '../models/cclist.model';
import APIResponse from '../helpers/APIResponse';
import APIError from '../helpers/APIError';
import Utils from '../helpers/Utils';
import constants from '../../config/constants';

const debug = require('debug')('rest-api:user.controller'); // eslint-disable-line

/**
 * Load user and append to req.
 */
export const load = (req, res, next, id) => {
  authCtrl.verifyAccessToken(req, res, (err) => {
    if (err) {
      return next(err);
    }
    return new UserModel().where('t1._id::varchar=$1').findOne([id])
      .then((user) => {
        // not found
        if (user === null) {
          return next(new APIError('No such user exists!', httpStatus.NOT_FOUND));
        }
        // found
        // delete password
        delete user.hashedPassword; // eslint-disable-line

        const finalResp = () => {
          req.user = user; // eslint-disable-line no-param-reassign
          return next();
        };
        // find linked students (if any)
        const uModel = new UserModel();
        const urModel = new UserRoleModel();
        urModel.reset().where('t1."user"::varchar=$1').findAll([user._id]).then((urResults) => {
          //
          urModel.reset().select('t1._id AS "userRoleId", t2.*')
            .join(`${uModel.getTable()} AS t2`, 't1."targetRef"::varchar=t2."_id"::varchar') // eslint-disable-line
            .where('t1."user"::varchar=$1')
            .getDataPair([user._id], ['userRoleId']).then(linkedStudents => { // eslint-disable-line
              const lsResults = [];
              for (let i = 0; i < urResults.length; i++) { // eslint-disable-line
                const urid = urResults[i]._id;
                const ls = UserModel.extractData(linkedStudents[urid]);
                delete ls.userRoleId;
                urResults[i].targetUserInfo = ls; // eslint-disable-line
                lsResults.push(urResults[i]);
              }
              user.roles = lsResults; // eslint-disable-line
              return finalResp();
            }).catch(e => { // eslint-disable-line
              debug('get linked students error: ', e);
              return finalResp();
            });
          //
        }).catch(e => finalResp()); // eslint-disable-line
        //
      }).catch(e => next(e)); // eslint-disable-line
  });
};

/**
 * Get user
 * @returns {UserModel}
 */
export const get = (req, res, next) => {
  const jwtInfo = authCtrl.getJwtInfo(req);
  if (authCtrl.isUser(req) && jwtInfo.userId !== req.user._id) {
    return next(new APIError('Forbidden', httpStatus.FORBIDDEN, true));
  }
  return res.json(new APIResponse(UserModel.extractData(req.user)));
};

/**
 * Create new user
 * @property {string} req.body.email
 * @property {string} req.body.password
 * @property {string} req.body.firstName
 * @property {string} req.body.lastName
 * @returns {UserModel}
 */
export const create = (req, res, next) => {
  //
  const id = Utils.uuid();
  const email = req.body.email;
  const username = req.body.username || id;
  // validate email
  const validateEmail = new UserModel().where('lower(t1.email)=$1').findCount([email]).then((cnt) => {
    const err = new APIError(constants.errors.emailRegisted, httpStatus.OK, true);
    return (cnt === 0 ? Promise.resolve() : Promise.reject(err));
  });
  // validate username
  const validateUsername = new UserModel().where('t1.username=$1').findCount([username]).then((cnt) => {
    const err = new APIError(constants.errors.usernameRegisted, httpStatus.OK, true);
    return (cnt === 0 ? Promise.resolve() : Promise.reject(err));
  });
  //
  const promises = [validateEmail, validateUsername];
  // validate parent (if any)
  const reqStatus = req.body.status || [];
  if (typeof req.body.parentId === 'string' && req.body.parentId.length > 0 && Utils.isNotEmptyArray(reqStatus) &&
    (reqStatus.indexOf('student') !== -1 || reqStatus.indexOf('STUDENT') !== -1)) {
    const validateParent = new UserModel().where('t1._id::varchar=$1').findOne([req.body.parentId]).then((parentData) => {
      const err = new APIError(constants.errors.wrongUsername, httpStatus.OK, true);
      return (parentData === null ? Promise.reject(err) : Promise.resolve(parentData));
    });
    promises.push(validateParent);
  }
  //
  Promise.all(promises).then((results) => { // eslint-disable-line
    // create data
    const salt = Utils.getSalt();
    var data = { // eslint-disable-line
      _id: id,
      username,
      email,
      phone: req.body.phone || '',
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      salt,
      hashedPassword: Utils.encrypt(req.body.password, salt),
      provider: 'local',
      dateCreated: new Date().getTime(),
      role: req.body.role || 'user',
    };
    if (Utils.isNotEmptyObject(req.body.metadata || {})) {
      data.metadata = req.body.metadata;
    }
    if (Utils.isNotEmptyArray(req.body.status || [])) {
      data.status = req.body.status;
    }
    // check to add linkCode if is Student
    if (results.length > 2) {
      data.linkCode = Utils.generateLinkCode();
    }
    // insert
    return new UserModel().insert(data).then((savedUser) => {
      if (savedUser === null) {
        return Promise.reject(new APIError(constants.errors.registerError, httpStatus.OK, true));
      }
      if (results.length === 2) {
        return Promise.resolve(savedUser);
      }
      // in this case, now the savedUser is student, then insert to user_roles
      const parentUserData = results[2];
      const userRoleData = {
        _id: Utils.uuid(),
        user: parentUserData._id,
        role: 'guardian',
        targetModel: 'user',
        targetRef: savedUser._id,
      };
      return new UserRoleModel().insert(userRoleData).then(savedUserRole => Promise.resolve(savedUser)).catch(e => { // eslint-disable-line
        debug('insert student into user_roles error: ', e);
        return Promise.resolve(savedUser);
      }); // eslint-disable-line
    });
  }).then((savedUser) => res.json(new APIResponse(UserModel.extractData(savedUser)))).catch(e => next(e)); // eslint-disable-line
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
export const update = (req, res, next) => {
  const jwtInfo = authCtrl.getJwtInfo(req);
  if (authCtrl.isUser(req) && jwtInfo.userId !== req.user._id) {
    return next(new APIError('Forbidden', httpStatus.FORBIDDEN, true));
  }

  const promises = [];
  const userData = Utils.copy(req.user);
  if (userData.roles) {
    delete userData.roles;
  }
  // validate email (if any)
  if (typeof req.body.email !== 'undefined') {
    const validateEmail = new UserModel().where('t1._id::varchar!=$1 AND lower(t1.email)=$2').findCount([userData._id, req.body.email]).then((cnt) => {
      const err = new APIError(constants.errors.emailRegisted, httpStatus.OK, true);
      return (cnt === 0 ? Promise.resolve() : Promise.reject(err));
    });
    promises.push(validateEmail);
  }

  // update data
  const optionalParams = ['email', 'phone', 'firstName', 'lastName'];
  for (let i = 0; i < optionalParams.length; i++) { // eslint-disable-line
    const param = optionalParams[i];
    if (typeof req.body[param] !== 'undefined') {
      userData[param] = req.body[param];
    }
  }
  // encrypt password (if any)
  if (typeof req.body.password !== 'undefined') {
    userData.hashedPassword = Utils.encrypt(req.body.password, userData.salt);
  }
  //
  promises.push(new UserModel().where('t1._id::varchar=$1').update(userData, [userData._id]));

  return Promise.all(promises).then((results) => {
    const savedUser = (promises.length === 2 ? results[1] : results[0]);
    return res.json(new APIResponse(savedUser !== null ? UserModel.extractData(savedUser[0]) : savedUser)); // eslint-disable-line
  }).catch(e => next(e));
};

/**
 * Get user list.
 * @returns {UserModel[]}
 */
export const list = (req, res, next) => {
  const { name = '', email = '' } = req.body;

  const uModel = new UserModel();

  if (email) {
    uModel.where(`lower(t1.email) LIKE '%${email.toLowerCase()}%'`);
  }

  if (name) {
    uModel.where(`lower(t1."firstName") LIKE '%${name.toLowerCase()}%' OR lower(t1."lastName") LIKE '%${name.toLowerCase()}%'`);
  }

  return uModel.findCount().then((total) => {
    let { page = 1 } = req.body;
    const limit = 15;
    const offset = (parseInt(page, 10) - 1) * limit;
    const pages = Math.ceil(total / limit);

    if (page > pages) {
      page = pages;
    }

    if (total === 0) {
      return res.json(new APIResponse({
        data: [],
        page,
        totalPages: pages
      }));
    }

    return uModel
      .limit(limit).offset(offset)
      .findAll().then((data) => { // eslint-disable-line
        return res.json(new APIResponse({
          data,
          page,
          totalPages: pages
        }));
      });
  }).catch(e => next(e));
};

/**
 * Delete user.
 * @returns {UserModel}
 */
export const remove = (req, res, next) => {
  const jwtInfo = authCtrl.getJwtInfo(req);
  if (authCtrl.isUser(req) && jwtInfo.userId !== req.user._id) {
    return next(new APIError('Forbidden', httpStatus.FORBIDDEN, true));
  }

  const userData = req.user;
  return new UserModel().where('_id::varchar=$1').delete([userData._id])
    .then(deletedUser => res.json(new APIResponse(deletedUser !== null ? UserModel.extractData(deletedUser[0]) : deletedUser))) // eslint-disable-line
    .catch(e => next(e));
};

/**
 * Get cc list of a specific user.
 * @returns {CCListModel[]}
 */
export const cclist = (req, res, next) => { // eslint-disable-line
  new CCListModel()
    .where('t1."userId"::varchar=$1')
    .orderBy('"name" ASC')
    .findAll([req.user._id])
    .then((cc) => {
      const flist = ['name', 'ccnum', 'ccmonth', 'ccyear', 'cvv'];
      for (let i = 0; i < cc.length; i++) {  // eslint-disable-line
        try {
          for (let j = 0; j < flist.length; j++) { // eslint-disable-line
            const fn = flist[j];
            cc[i][fn] = Utils.aesDecrypt(cc[i][fn], constants.ccSecret); // eslint-disable-line
            if (fn === 'ccnum') {
              cc[i][fn] = (cc[i][fn] + '').replace(/.(?=.{3,}$)/g, "*"); // eslint-disable-line
            }
          }
        } catch (ex) { } // eslint-disable-line
      }
      return res.json(new APIResponse(cc));
    })
    .catch(e => next(e));
};

/**
 * Link student to current logged-in parent
 * @returns {CCListModel[]}
 */
export const linkStudent = (req, res, next) => {
  const { userId, isParent } = authCtrl.getJwtInfo(req) || {};
  if (!userId || !isParent) {
    return next(new APIError(constants.errors.notParent, httpStatus.OK, true));
  }

  const email = req.body.email || '';
  const linkCode = parseInt(req.body.linkCode || 0, 10);

  if (isNaN(linkCode)) {
    return next(new APIError(constants.errors.linkCodeNotFound, httpStatus.OK, true));
  }

  return new UserModel().where('lower(t1.email)=$1').findOne([email]).then((objStudent) => {
    // validate student account
    if (objStudent === null) {
      return Promise.reject(new APIError(constants.errors.studentEmailNotFound, httpStatus.OK, true)); // eslint-disable-line
    }
    if (objStudent.linkCode !== linkCode) {
      return Promise.reject(new APIError(constants.errors.linkCodeNotFound, httpStatus.OK, true));
    }
    const isStudent = (objStudent.status.indexOf('student') === -1 || objStudent.status.indexOf('STUDENT') === -1);
    if (!isStudent) {
      return Promise.reject(new APIError(constants.errors.studentEmailNotFound, httpStatus.OK, true)); // eslint-disable-line
    }
    // check if already link to parent before
    return new UserRoleModel().where('role=$1 AND t1."targetRef"::varchar=$2').findOne(['guardian', objStudent._id]).then((objUM) => {
      // check if linked before ot not
      if (objUM !== null) {
        if (objUM.user !== userId) {
          // already linked before to another parent account
          return Promise.reject(new APIError(constants.errors.alreadyLinkedToAnotherParent, httpStatus.OK, true)); // eslint-disable-line
        }
        // already linked before to current parent account
        return Promise.resolve(objStudent);
      }
      // link now
      const userRoleData = {
        _id: Utils.uuid(),
        user: userId,
        role: 'guardian',
        targetModel: 'user',
        targetRef: objStudent._id,
      };
      return new UserRoleModel().insert(userRoleData).then(savedUserRole => Promise.resolve(objStudent)).catch(e => Promise.reject(e)); // eslint-disable-line
    }).catch(e => Promise.reject(e)); // eslint-disable-line
  }).then((objStudent) => res.json(new APIResponse(UserModel.extractData(objStudent)))).catch(e => next(e)); // eslint-disable-line
};

export default { load, get, create, update, list, remove, cclist };
