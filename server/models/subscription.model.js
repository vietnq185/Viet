import AppModel from './app.model';
import Utils from '../helpers/Utils';

/**
 * Class SubscriptionModel.
 */
class SubscriptionModel extends AppModel {
  //
  constructor() {
    const table = 'subscriptions';
    const primaryKey = '_id';
    const schema = {
      _id: {
        type: 'varchar'
      },
    };

    // super(StringTableName, StringPrimaryKey, ObjectSchema);
    super(table, primaryKey, schema);
  }

  static extractData(subscriptionData) {
    if (!Utils.isNotEmptyObject(subscriptionData)) {
      return subscriptionData;
    }
    const excludeFields = [];
    var obj = Utils.copy(subscriptionData); // eslint-disable-line
    for (var i = 0; i < excludeFields.length; i++) { // eslint-disable-line
      const fn = excludeFields[i];
      if (typeof obj[fn] !== 'undefined') {
        delete obj[fn];
      }
    }
    return obj;
  }
}

/**
 * @typedef Subscription
 */
export default SubscriptionModel;
