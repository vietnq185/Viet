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
 * Class UserRoleModel.
 */
var UserRoleModel = function (_AppModel) {
  _inherits(UserRoleModel, _AppModel);

  //
  function UserRoleModel() {
    _classCallCheck(this, UserRoleModel);

    var table = 'user_roles';
    var primaryKey = '_id';
    var schema = {
      _id: {
        type: 'varchar'
      }
    };

    // super(StringTableName, StringPrimaryKey, ObjectSchema);
    return _possibleConstructorReturn(this, (UserRoleModel.__proto__ || Object.getPrototypeOf(UserRoleModel)).call(this, table, primaryKey, schema));
  }
  //


  return UserRoleModel;
}(_app2.default);

/**
 * @typedef User
 */


exports.default = UserRoleModel;
module.exports = exports['default'];
//# sourceMappingURL=user.role.model.js.map
