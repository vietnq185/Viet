/*eslint-disable*/

import OptionModel from '../models/option.model';
import constants from '../../config/constants';
import config from '../../config/config';

const CryptoJS = require("crypto-js");
const sha3 = require('crypto-js/sha3');
const aes = require('crypto-js/aes');

const crypto = require('crypto');
const uuidV4 = require('uuid/v4');

const nodemailer = require('nodemailer');

/**
 * Constructor
 */
var Utils = function () { };

/**
* Check if error is defined in constants.
* @param {string} str
* @return {boolean}
*/
Utils.isAppError = function (str) {
  const arr = Object.values(constants.errors);
  return (arr.indexOf(str) !== -1);
}

Utils.sha3Encrypt = (str) => {
  const SHA3_OPTS = { outputLength: 256 };
  return sha3(str, SHA3_OPTS).toString();
};

Utils.aesEncrypt = (str, secret) => {
  str += '';
  return aes.encrypt(str, Utils.sha3Encrypt(secret)).toString();
} // eslint-disable-line

Utils.aesDecrypt = (encryptedStr, secret) => { // eslint-disable-line
  encryptedStr += '';
  const bytes = aes.decrypt(encryptedStr, Utils.sha3Encrypt(secret));
  try {
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return '';
  }
};

/**
* Create random string.
* @return {string}
*/
Utils.getSalt = function () {
  return crypto.randomBytes(16).toString('base64');
}

/**
* Encrypt a string with specific salt.
* @param {string} password
* @param {string} salt
* @return {string}
*/
Utils.encrypt = function (password, salt) {
  const saltBuffer = new Buffer(salt, 'base64');
  return crypto.pbkdf2Sync(password || '', saltBuffer, 10000, 64).toString('base64');
}

/**
* Check if is a not empty object.
* @param {object} obj
* @return {object}
*/
Utils.isNotEmptyObject = function (obj) {
  return (typeof obj === 'object' && obj !== null && obj.constructor !== Array && Object.keys(obj).length > 0);
}

/**
* Check if is a not empty array.
* @param {array} arr
* @return {boolean}
*/
Utils.isNotEmptyArray = function (arr) {
  return (typeof arr !== 'undefined' && arr !== null && arr.constructor === Array && arr.length > 0);
}

/**
* Check if is a not empty string.
* @param {string} str
* @return {boolean}
*/
Utils.isNotEmptyString = function (str) {
  return (typeof str === 'string' && str.length > 0);
}

/**
* Deep copy an object
* @param {object} obj
* @return {object}
*/
Utils.copy = function (obj) {
  try {
    if (Utils.isNotEmptyObject(obj)) {
      var str = JSON.stringify(obj);
      return JSON.parse(str);
    }
    return obj;
  }
  catch (ex) {
    return Utils.shallowCopy(obj);
  }
}

/**
* Shallow copy an object
* @param {object} obj
* @return {object}
*/
Utils.shallowCopy = function (obj) {
  if (Utils.isNotEmptyObject(obj)) {
    var retObj = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        retObj[key] = obj[key];
      }
    }
    return retObj;
  }
  return obj;
}

/**
* Clean up all properties of an object
* @param {object} object
* @return {object}
*/
Utils.cleanUp = function (object) {
  if (Utils.isNotEmptyObject(object)) {
    for (var el in object) {
      if (typeof (object[el]) === 'object') {
        Utils.cleanUp(object[el]);
      }
      else {
        object[el] = undefined;
        delete object[el];
        Utils.cleanUp(object);
      }
    }
  }
  return object;
}

/**
* Merge properties of objDst to objSrc
* @param {object} objSrc
* @param {object} objDst
* @return {object}
*/
var mergeTwoObjects = function (objSrc, objDst) {
  if (!Utils.isNotEmptyObject(objSrc)) {
    objSrc = {};
  }
  if (!Utils.isNotEmptyObject(objDst)) {
    objDst = {};
  }
  var src = Utils.copy(objSrc);
  var dst = Utils.copy(objDst);
  for (var key in dst) {
    if (dst.hasOwnProperty(key)) {
      src[key] = dst[key];
    }
  }
  return src;
}

/**
* Merge properties of all objects into the first one
* @return {object}
*/
Utils.merge = function () {
  var obj = {};
  var args = arguments;
  if (args.length > 0) {
    for (var i = 0; i < args.length; i++) {
      obj = mergeTwoObjects(obj, args[i]);
    }
  }
  return obj;
}

/**
* Generate uuid V4
* @return {string}
*/
Utils.uuid = function () {
  return uuidV4();
}

/**
* Deep compare two object
* @param {object} obj1
* @param {object} obj2
* @return {boolean}
*/
Utils.compareObjects = function (obj1, obj2) {
  var result = null;
  try {
    var str1 = JSON.stringify(obj1);
    var str2 = JSON.stringify(obj2);
    return (str1 === str2);
  }
  catch (ex) {
    return deepCompare(obj1, obj2);
  }

  // START: http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
  function deepCompare() {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
      var p;
      // remember that NaN === NaN returns false
      // and isNaN(undefined) returns true
      if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
        return true;
      }
      // Compare primitives and functions.
      // Check if both arguments link to the same object.
      // Especially useful on the step where we compare prototypes
      if (x === y) {
        return true;
      }
      // Works in case when functions are created in constructor.
      // Comparing dates is a common scenario. Another built-ins?
      // We can even handle functions passed across iframes
      if ((typeof x === 'function' && typeof y === 'function') || (x instanceof Date && y instanceof Date) || (x instanceof RegExp && y instanceof RegExp) || (x instanceof String && y instanceof String) || (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
      }
      // At last checking prototypes as good as we can
      if (!(x instanceof Object && y instanceof Object)) {
        return false;
      }
      if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
      }
      if (x.constructor !== y.constructor) {
        return false;
      }
      if (x.prototype !== y.prototype) {
        return false;
      }
      // Check for infinitive linking loops
      if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
        return false;
      }
      // Quick checking of one object being a subset of another.
      // todo: cache the structure of arguments[0] for performance
      for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false;
        } else if (typeof y[p] !== typeof x[p]) {
          return false;
        }
      }
      for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false;
        } else if (typeof y[p] !== typeof x[p]) {
          return false;
        }
        switch (typeof (x[p])) {
          case 'object':
          case 'function':
            leftChain.push(x);
            rightChain.push(y);
            if (!compare2Objects(x[p], y[p])) {
              return false;
            }
            leftChain.pop();
            rightChain.pop();
            break;
          default:
            if (x[p] !== y[p]) {
              return false;
            }
            break;
        }
      }
      return true;
    }
    if (arguments.length < 1) {
      return true; //Die silently? Don't know how to handle such case, please help...
      // throw "Need two or more arguments to compare";
    }
    for (i = 1, l = arguments.length; i < l; i++) {
      leftChain = []; //Todo: this can be cached
      rightChain = [];
      if (!compare2Objects(arguments[0], arguments[i])) {
        return false;
      }
    }
    return true;
  }
  // END: http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
}

Utils.ucfirst = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

Utils.correctAddress = function (address) {
  return ('0x' + address.replace('0x', ''));
}

Utils.syncLoop = function (iterations, process, exit) {
  var index = 0,
    done = false,
    shouldExit = false;
  var loop = {
    next: function () {
      if (done) {
        if (shouldExit && exit) {
          return exit(); /*Exit if we're done*/
        }
      }
      /*If we're not finished*/
      if (index < iterations) {
        index++; /*Increment our index*/
        process(loop); /*Run our process, pass in the loop*/
        /*Otherwise we're done*/
      } else {
        done = true; /*Make sure we say we're done*/
        if (exit) exit(); /*Call the callback on exit*/
      }
    },
    iteration: function () {
      return index - 1; /*Return the loop number we're on*/
    },
    break: function (end) {
      done = true; /*End the loop*/
      shouldExit = end; /*Passing end as true means we still call the exit callback*/
    }
  };
  loop.next();
  return loop;
}

/**
   * Find all records and parse into key => value object.
   * @param {Array} results // Array of object.
   * @param {String|Array} arrKeyFields // a field or a list of fields
   * @param {String|Array} arrResultFields // Optional. A list of fields or * (means all)
   * @param {String} strKeySeparator // Optional. Separator beween key fields
   * @returns {Promise}
   */
Utils.getDataPair = function (results, arrKeyFields, arrResultFields = '*', strKeySeparator = '~:~') {
  try {
    // convert one item of string to array
    if (!Utils.isNotEmptyArray(arrKeyFields)) {
      arrKeyFields = [arrKeyFields]; // eslint-disable-line
    }
    //
    const getKey = (item, fields, separator) => {
      var arr = []; // eslint-disable-line
      for (let i = 0; i < fields.length; i++) { // eslint-disable-line
        const fn = fields[i];
        arr.push(typeof item[fn] !== 'undefined' ? item[fn] : '');
      }
      return arr.join(separator);
    };
    //
    const getValue = (item, fields) => {
      var obj = {}; // eslint-disable-line
      for (let i = 0; i < fields.length; i++) { // eslint-disable-line
        const fn = fields[i];
        obj[fn] = (typeof item[fn] !== 'undefined' ? item[fn] : null);
      }
      return obj;
    };
    //
    var objResults = {}; // eslint-disable-line
    for (var i = 0; i < results.length; i++) { // eslint-disable-line
      const item = results[i];
      //
      const key = getKey(item, arrKeyFields, strKeySeparator);
      //
      const value = Utils.isNotEmptyArray(arrResultFields) ? getValue(item, arrResultFields) : item; // eslint-disable-line
      //
      objResults[key] = value; // eslint-disable-line
      //
    }
    return objResults;
    //
  } catch (ex) {
    return ex;
  }
}

/*
function sendMail
@options = {
    from: string (optional),
    to: string (required),
    template: string (required),    // name of sub-folder in templates directory. In this sub-folder MUST have following files: subject.ejs AND (html.ejs OR text.ejs)
    templateVars: object (optional) // an object include variables that need to parse in template
}
*/

/**
 * send email.
 * @param {object} options // object.
 * @property {string} from (optional)
 * @property {string} to
 * @property {string} template // template key get from option, for example if we define mail_forgot_password_ARRAY_message, the template will be mail_forgot_password
 * @property {object} data  // data to replace the tokens (token defination is in config/constants.js)
 * @returns {Promise}
 * 
 * Example: 
 * Utils.sendMail({
    to: 'mrdamtn@gmail.com',
    template: 'mail_forgot_password',
    data: {
      firstName: 'NGOC',
      lastName: 'DAM',
      resetPasswordUrl: 'http://localhost:3000/resetPassword/this_should_be_hash'
    }
  }).then(result => {
    console.log('SEND EMAIL success: ', result);
  }).catch(err => {
    console.log('SEND EMAIL with error: ', err);
  });
 * 
 */
Utils.sendMail = (options) => {
  // // **NOTE**: Did you know `nodemailer` can also be used to send SMTP email through Mandrill, Mailgun, Sendgrid and Postmark?
  // <https://github.com/andris9/nodemailer-wellknown#supported-services>

  return new Promise((resolve, reject) => {
    return new OptionModel().getPairs().then((dataOpts) => {
      const { from = dataOpts.o_admin_email, to, template, data } = options;
      const tokens = constants.emailTokens[template];
      let { subject, message } = dataOpts[template];

      //
      const replaceTokens = (tpl) => {
        let retTpl = tpl;
        for (let i = 0; i < tokens.length; i++) {
          const tkn = tokens[i];
          const key = tkn.replace(/{/g, '').replace(/}/g, '');
          if (typeof data[key] !== 'undefine') {
            const pattern = new RegExp(tkn, 'g');
            retTpl = retTpl.replace(pattern, data[key]);
          }
        }
        return retTpl;
      }

      //
      subject = replaceTokens(subject);
      message = replaceTokens(message);

      //send email
      // if (config.env === 'development') {
      //   let SMTP_CONFIG = {
      //     host: dataOpts.o_smtp_host,
      //     port: dataOpts.o_smtp_port,
      //     secure: true, // use SSL 
      //     auth: {
      //       user: dataOpts.o_smtp_user,
      //       pass: dataOpts.o_smtp_pass
      //     }
      //   };
      // }
      // else {
      //   let SMTP_CONFIG = {
      //     service: 'gmail',
      //     auth: {
      //       user: dataOpts.o_smtp_user,
      //       pass: dataOpts.o_smtp_pass
      //     }
      //   }
      // }

      let SMTP_CONFIG = {
        service: 'gmail',
        auth: {
          user: dataOpts.o_smtp_user,
          pass: dataOpts.o_smtp_pass
        }
      }

      const transporter = nodemailer.createTransport(SMTP_CONFIG);
      const MAIL_OPTIONS = { from, to, subject, html: message };
      return transporter.sendMail(MAIL_OPTIONS, (err, info) => {
        if (err) {
          return reject(err);
        }
        resolve(info);
      });
    }).catch(reject);
  });
}

Utils.getServerUrl = (req) => {
  //const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const serverUrl = req.protocol + '://' + req.get('host');
  return serverUrl;
}

export default Utils;
