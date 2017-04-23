import AppModel from './app.model';

/**
 * Class UserRoleModel.
 */
class UserRoleModel extends AppModel {
  //
  constructor() {
    const table = 'user_roles';
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
export default UserRoleModel;
