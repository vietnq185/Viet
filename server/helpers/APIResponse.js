"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing an API response.
 */
var APIExtendableResponse =
/**
 * Creates an API response.
 * @param {boolean} boolSuccess - Error message.
 * @param {object} objResult - result object, only availabe in case request success.
 * @param {object} objError - an instance of APIError, only availabe in case request failed.
 */
function APIExtendableResponse(boolSuccess, objResult, objError) {
  _classCallCheck(this, APIExtendableResponse);

  this.success = boolSuccess;
  this.result = objResult;
  this.error = objError;
};

/**
 * Class representing an API success response.
 */


var APIResponse = function (_APIExtendableRespons) {
  _inherits(APIResponse, _APIExtendableRespons);

  /**
   * Creates an API success response.
   * @param {object} objResult - result object, only availabe in case request success.
   */
  function APIResponse(objResult) {
    _classCallCheck(this, APIResponse);

    return _possibleConstructorReturn(this, (APIResponse.__proto__ || Object.getPrototypeOf(APIResponse)).call(this, true, objResult, null));
  }

  return APIResponse;
}(APIExtendableResponse);

/**
 * Class representing an API Error response.
 */


exports.default = APIResponse;

var APIErrorResponse = exports.APIErrorResponse = function (_APIExtendableRespons2) {
  _inherits(APIErrorResponse, _APIExtendableRespons2);

  /**
   * Creates an API Error response.
   * @param {object} objError - an instance of APIError, only availabe in case request failed.
   */
  function APIErrorResponse(objError) {
    _classCallCheck(this, APIErrorResponse);

    return _possibleConstructorReturn(this, (APIErrorResponse.__proto__ || Object.getPrototypeOf(APIErrorResponse)).call(this, false, null, objError));
  }

  return APIErrorResponse;
}(APIExtendableResponse);
//# sourceMappingURL=APIResponse.js.map
