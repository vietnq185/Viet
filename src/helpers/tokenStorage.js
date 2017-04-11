import config from '../config'
import SimpleStorage from './simpleStorage'

const STORAGE_NAME = config.storageName + '_TokenStorage'

const STORAGE_KEY = config.tokenKey + '_StorageKey'

const getInstance = () => new SimpleStorage(STORAGE_NAME)

export default class TokenStorage {

  static get = () => {
    const storage = getInstance()
    return storage.get(STORAGE_KEY) || {}
  }

  static set = (data) => {
    const storage = getInstance()
    storage.add({
      _id: STORAGE_KEY,
      ...data
    })
  }

  static delete = () => {
    const storage = getInstance()
    storage.remove(STORAGE_KEY)
  }

}
