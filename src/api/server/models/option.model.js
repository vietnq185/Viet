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

  getPairs(foreignId = 1, isPublic = false) {
    const self = this;
    return new Promise((resolve, reject) => { // eslint-disable-line
      self.reset().where('t1.foreign_id=$1').orderBy('t1."order" ASC');
      if (isPublic) {
        self.where("t1.is_public='T'");
      }
      self.findAll([foreignId]).then((results) => { // eslint-disable-line
        const obj = {};
        for (let i = 0; i < results.length; i++) { // eslint-disable-line
          const { key, value, type } = results[i];
          switch (type) {
            case 'enum':
            case 'bool': // eslint-disable-line
              const tmpArr = value.split('::');
              obj[key] = tmpArr[1];
              break;
            case 'float':
              obj[key] = parseFloat(value);
              break;
            case 'int':
              obj[key] = parseInt(value, 10);
              break;
            default: // eslint-disable-line
              obj[key] = value;
          }
          // parse option that is organized as an array
          const groupSeparator = '_ARRAY_';
          const groupArr = key.split(groupSeparator);
          if (groupArr.length === 2) {
            const groupKey = groupArr[0];
            const groupItemKey = groupArr[1];
            if (typeof obj[groupKey] === 'undefined') {
              obj[groupKey] = {};
            }
            obj[groupKey][groupItemKey] = obj[key]; // keep value parse before
            delete obj[key];
          }
        }
        return resolve(obj);
      }).catch((err) => { // eslint-disable-line
        console.log('OptionModel => getPairs => err: ', err); // eslint-disable-line
        return resolve({});
      });
    });
  }

  //
}

/**
 * @typedef User
 */
export default OptionModel;
