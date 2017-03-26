import Promise from 'bluebird';
import httpStatus from 'http-status';

import AppModel from './app.model';
import APIError from '../helpers/APIError';

/**
 * Class UserModel.
 */
class UserModel extends AppModel {
  //
  constructor() {
    // super(StringTableName, StringPrimaryKey, ObjectSchema);
    super('Users', '_id');
  }
  //
}

/**
 * @typedef User
 */
export default UserModel;
