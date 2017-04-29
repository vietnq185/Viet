import AppModel from './app.model';

/**
 * Class PaymentHistoryModel.
 */
class PaymentHistoryModel extends AppModel {
  //
  constructor() {
    const table = 'payment_history';
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
export default PaymentHistoryModel;
