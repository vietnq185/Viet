import AppModel from './app.model';
import Utils from '../helpers/Utils';

/**
 * Class UserModel.
 */
class UserModel extends AppModel {
  //
  constructor() {
    const table = 'users';
    const primaryKey = '_id';
    const schema = {
      _id: {
        type: 'varchar'
      },
    };

    // super(StringTableName, StringPrimaryKey, ObjectSchema);
    super(table, primaryKey, schema);
  }

  static extractData(userData) {
    if (!Utils.isNotEmptyObject(userData)) {
      return userData;
    }
    const excludeFields = ['salt', 'hashedPassword'];
    var obj = Utils.copy(userData); // eslint-disable-line
    for (var i = 0; i < excludeFields.length; i++) { // eslint-disable-line
      const fn = excludeFields[i];
      if (typeof obj[fn] !== 'undefined') {
        delete obj[fn];
      }
    }
    return obj;
  }
  //
}

/**
 * @typedef User
 */
export default UserModel;
