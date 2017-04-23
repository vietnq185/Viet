/*eslint-disable*/

import config from '../config';
import CustomError from './error';
import Utils from './utils';
import SimpleStorage from './simpleStorage';

/**
* Create SampleCollection collection extends SimpleStorage
* @return {object} // instance of SampleCollection
*/
export default function SampleCollection() {
  var self = this;
  self._collectionName = config.network + '_SampleCollection';
  self._schema = {
    // define schema properties here
  };
  SimpleStorage.call(self, self._collectionName);
}
SampleCollection.prototype = Object.create(SimpleStorage.prototype);
SampleCollection.prototype.constructor = SampleCollection;
