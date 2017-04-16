'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _app = require('./app.model');

var _app2 = _interopRequireDefault(_app);

var _Utils = require('../helpers/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class SubscriptionModel.
 */
var SubscriptionModel = function (_AppModel) {
  _inherits(SubscriptionModel, _AppModel);

  //
  function SubscriptionModel() {
    _classCallCheck(this, SubscriptionModel);

    var table = 'subscriptions';
    var primaryKey = '_id';
    var schema = {
      _id: {
        type: 'varchar'
      }
    };

    // super(StringTableName, StringPrimaryKey, ObjectSchema);
    return _possibleConstructorReturn(this, (SubscriptionModel.__proto__ || Object.getPrototypeOf(SubscriptionModel)).call(this, table, primaryKey, schema));
  }

  _createClass(SubscriptionModel, null, [{
    key: 'extractData',
    value: function extractData(subscriptionData) {
      if (!_Utils2.default.isNotEmptyObject(subscriptionData)) {
        return subscriptionData;
      }
      var excludeFields = [];
      var obj = _Utils2.default.copy(subscriptionData); // eslint-disable-line
      for (var i = 0; i < excludeFields.length; i++) {
        // eslint-disable-line
        var fn = excludeFields[i];
        if (typeof obj[fn] !== 'undefined') {
          delete obj[fn];
        }
      }
      return obj;
    }
  }]);

  return SubscriptionModel;
}(_app2.default);

/**
 * @typedef Subscription
 */


exports.default = SubscriptionModel;
module.exports = exports['default'];
//# sourceMappingURL=subscription.model.js.map
