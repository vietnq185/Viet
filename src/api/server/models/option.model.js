import AppModel from './app.model';

/**
 * Class OptionModel.
 */
class OptionModel extends AppModel {
  //
  constructor() {
    const table = 'options';
    const primaryKey = '';
    const schema = {};

    // super(StringTableName, StringPrimaryKey, ObjectSchema);
    super(table, primaryKey, schema);
  }

  getAllPairs(foreignId = 1) {
    const self = this;
    return new Promise((resolve, reject) => { // eslint-disable-line
      self.reset().where('t1.foreign_id=$1').orderBy('t1."order" ASC').getDataPair([foreignId], ['key'], ['value']).then((results) => {
        return resolve(results);
      }).catch((err) => { // eslint-disable-line
        console.log('OptionModel => getAllPairs=> err: ', err); // eslint-disable-line
        return resolve({});
      });
    });
  }

  getPairs(foreignId = 1) {
    const self = this;
    return new Promise((resolve, reject) => { // eslint-disable-line
      self.reset().where('t1.foreign_id=$1').orderBy('t1."order" ASC').findAll([foreignId]).then((results) => { // eslint-disable-line
        const obj = {};
        for (let i = 0; i < results.length; i++) { // eslint-disable-line
          const row = results[i];
          switch (row.type) {
            case 'enum':
            case 'bool': // eslint-disable-line
              const tmpArr = row.value.split('::');
              obj[row.key] = tmpArr[1];
              break;
            default:
              obj[row.key] = row.value;
              break;
          }
        }
        return resolve(obj);
      }).catch((err) => { // eslint-disable-line
        console.log('OptionModel => getPairs => err: ', err); // eslint-disable-line
        return resolve([]);
      });
    });
  }

  //
}

/**
 * @typedef User
 */
export default OptionModel;
