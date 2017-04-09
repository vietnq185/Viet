/*eslint-disable*/

import CustomError from './error';
import Utils from './utils';

/**
* This class treats like a collection.
* param {string} storageId // collection name
* @return {object} // instance of SimpleStorage
*/
export default function SimpleStorage(storageId) {
  if (!(this instanceof SimpleStorage)) {
    return new SimpleStorage(storageId);
  }

  var self = this;

  if(!self._storageAvailable()) {
    throw new CustomError("LOCAL_STORAGE_NOT_SUPPORT", "The localStorage is not fully supported by your browser.");
  }

  /*if(!self._fileReaderAvailable()) {
    throw new CustomError("FILE_READER_NOT_SUPPORT", "The File APIs are not fully supported by your browser.");
  }*/

  if(typeof storageId !== "string" || storageId.length == 0) {
    throw new CustomError("INVALID_STORAGE_ID", "Invalid storageId");
  }

  self._storage = localStorage;

  self._storageName = storageId;

  // default data is empty object
  self._data = {};

  // load
  self._load();

  return self;
}

SimpleStorage.prototype = {

  // --------------- Private functions ------------------

  /**
  * Check if browser supports localStorage or not
  * @return {boolean}
  */
  _storageAvailable: function() {
    try {
      var storage = window.localStorage,
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return false;
    }
  },

  /**
  * Check if browser supports FileReader or not
  * @return {boolean}
  */
  _fileReaderAvailable: function() {
    try {
      // Check for the various File API support.
      if (typeof window.File !== "undefined" && typeof window.FileReader !== "undefined" && typeof window.FileList !== "undefined" && typeof window.Blob && window.File && window.FileReader && window.FileList && window.Blob) {
        return true;
      }
      throw new CustomError("FILE_READER_NOT_SUPPORT", "The File APIs are not fully supported by your browser.");
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return false;
    }
  },

  /**
  * load data from storage and assign to self._data
  * @return {boolean}
  */
  _load: function() {
    var self = this;
    try {
      var currentData = self._storage.getItem(self._storageName);
      if(currentData) {
        self._data = JSON.parse(currentData);
      }
      else {
        self._save();   // save default to storage
      }
      return true;
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return false;
    }
  },

  /**
  * save self._data to storage
  * @return {boolean}
  */
  _save: function() {
    var self = this;
    try {
      self._storage.setItem(self._storageName, JSON.stringify(self._data));
      return true;
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return false;
    }
  },

  _generateUniqueId: function() {
    var self = this;
    var id = Utils.guid();
    if(self.exist(id)) {
      return self._generateUniqueId();
    }
    return id;
  },

  // --------------- Public functions ------------------

  /**
  * Get all data
  * @return {object}
  */
  getAll: function() {
    var self = this;
    return Utils.copy(self._data);
  },

  /**
  * Get all Ids
  * @return {array}
  */
  getAllIds: function() {
    var self = this;
    return Object.keys(self.getAll());
  },

  /**
  * Check if id is exist
  * @param {id} string
  * @return {boolean}
  */
  exist: function(id) {
    var self = this;
    try {
      if(typeof id !== "string" || id.length == 0) {
        throw new CustomError("INVALID_ID", "Invalid id. Require a string.");
      }
      return (typeof self._data[id] !== "undefined");
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return true;    // assume the id exists if there is any error
    }
  },

  /**
  * Get data by id
  * @param {id} string
  * @return {object||null}
  */
  get: function(id) {
    var self = this;
    try {
      if(typeof id !== "string" || id.length == 0) {
        throw new CustomError("INVALID_ID", "Invalid id. Require a string.");
      }
      if(typeof self._data[id] === "undefined") {
        throw new CustomError("NOT_FOUND", "Data not found for id " + id);
      }
      if(Utils.isNotEmptyObject(self._data[id])) {
        return Utils.copy(self._data[id]);
      }
      return self._data[id];
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return null;
    }
  },

  /**
  * Add data
  * @param {object} data
  * @return {false||string} // return false, it means cannot add; return string, it means add success
  */
  add: function(data) {
    var self = this;
    try {
      if(!Utils.isNotEmptyObject(data)) {
        // is empty or invalid object
        throw new CustomError("INVALID_DATA", "Invalid data. Require an object.");
      }
      var id = data.id || data._id || self._generateUniqueId();
      var objNewData = Utils.copy(data);
      objNewData._id = id;    // assign new _id to object being inserted
      self._data[id] = objNewData;
      if(self._save()) {
        return id;
      }
      throw new CustomError("CANNOT_ADD_DATA", "Cannot add data.");
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return false;
    }
  },

  /**
  * Update {data} with {id}. Update only fields provided in data object
  * @param {string} id
  * @param {object} data
  * @return {boolean}
  */
  update: function(id, data) {
    var self = this;
    try {
      if(typeof id !== "string" || id.length == 0) {
        throw new CustomError("INVALID_ID", "Invalid id. Require a string.");
      }
      if(!Utils.isNotEmptyObject(data)) {
        // is empty or invalid object
        throw new CustomError("INVALID_DATA", "Invalid data. Require an object.");
      }
      if(typeof self._data[id] === "undefined") {
        throw new CustomError("NOT_FOUND", "Data not found for id " + id);
      }
      var objNewData = Utils.copy(data);
      objNewData._id = id;  // keep _id reference
      // keep properties that does not need to update
      var currentValue = self.get(id);
      for(var k in currentValue) {
        if(currentValue.hasOwnProperty(k) && typeof objNewData[k] === "undefined") {
          objNewData[k] = currentValue[k];
        }
      }
      self._data[id] = objNewData;
      return self._save();
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return false;
    }
  },

  /**
  * Remove data with {id}
  * @param {id} string
  * @return {boolean}
  */
  remove: function(id) {
    var self = this;
    try {
      if(typeof id !== "string" || id.length == 0) {
        throw new CustomError("INVALID_ID", "Invalid id. Require a string.");
      }
      if(typeof self._data[id] === "undefined") {
        throw new CustomError("NOT_FOUND", "Data not found for id " + id);
      }
      Utils.cleanUp(self._data[id]); // just clean up all properties of object, AND
      delete self._data[id];   // have to delete the empty object by id
      return self._save();
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return false;
    }
  },

  /**
  * Remove all data. Note that only data has been remove, the collection still available and it will be empty object
  * @return {boolean}
  */
  removeAll: function() {
    var self = this;
    try {
      Utils.cleanUp(self._data); // just clean up all properties of object, AND
      self._data = {};  // reset data
      return self._save();
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return false;
    }
  },

  /**
  * Replace {data} with {id}. Completely replace current data with new data. It is different with update
  * @param {string} id
  * @param {object} data
  * @return {boolean}
  */
  replace: function(id, data) {
    var self = this;
    try {
      if(self.remove(id)) {
        var objNewData = Utils.copy(data);
        objNewData._id = id;  // keep _id reference
        return self.add(objNewData);
      }
      return false;
    }
    catch(ex) {
      console.log('==========> SimpleStorage: ', ex.toString());
      return false;
    }
  },

};
