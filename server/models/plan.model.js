import AppModel from './app.model';

/**
 * Class PlanModel.
 */
class PlanModel extends AppModel {
  //
  constructor() {
    const table = 'plans';
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
export default PlanModel;
