import AppModel from './app.model';

/**
 * Class ItemModel.
 */
class ItemModel extends AppModel {
  //
  constructor() {
    const table = 'items';
    const primaryKey = '_id';
    const schema = {
    };

    // super(StringTableName, StringPrimaryKey, ObjectSchema);
    super(table, primaryKey, schema);
  }
  //
}

/**
 * @typedef Item
 */
export default ItemModel;
