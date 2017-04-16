'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _app = require('./app.model');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class CCListModel.
 */
var CCListModel = function (_AppModel) {
  _inherits(CCListModel, _AppModel);

  //
  function CCListModel() {
    _classCallCheck(this, CCListModel);

    var table = 'cclist';
    var primaryKey = '_id';
    var schema = {};

    // super(StringTableName, StringPrimaryKey, ObjectSchema);
    return _possibleConstructorReturn(this, (CCListModel.__proto__ || Object.getPrototypeOf(CCListModel)).call(this, table, primaryKey, schema));
  }
  //


  return CCListModel;
}(_app2.default);

/**
 * @typedef User
 */


exports.default = CCListModel;
module.exports = exports['default'];
//# sourceMappingURL=cclist.model.js.map
