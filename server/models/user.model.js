import AppModel from './app.model';

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
  //
}

/**
 * @typedef User
 */
export default UserModel;
