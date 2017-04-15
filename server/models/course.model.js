import AppModel from './app.model';

/**
 * Class CourseModel.
 */
class CourseModel extends AppModel {
  //
  constructor() {
    const table = 'courses';
    const primaryKey = '_id';
    const schema = {
    };

    // super(StringTableName, StringPrimaryKey, ObjectSchema);
    super(table, primaryKey, schema);
  }
  //
}

/**
 * @typedef Course
 */
export default CourseModel;
