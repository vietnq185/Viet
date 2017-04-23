import { combineReducers } from 'redux'
import locationReducer from './location'
import authReducer from './auth'
import subscribeReducer from '../routes/Subscribe/modules/subscribe'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    auth: authReducer,
    subscribe: subscribeReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
