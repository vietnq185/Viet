import AppModel from './app.model';

/**
 * Class CCListModel.
 */
class CCListModel extends AppModel {
  //
  constructor() {
    const table = 'cclist';
    const primaryKey = '_id';
    const schema = {
    };

    // super(StringTableName, StringPrimaryKey, ObjectSchema);
    super(table, primaryKey, schema);
  }
  //
}

/**
 * @typedef User
 */
export default CCListModel;
