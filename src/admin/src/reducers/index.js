// @flow
import { combineReducers } from 'redux';

import auth from './auth';
import user from './user';
import subscription from './subscription';

const rootReducer = combineReducers({
  auth,
  user,
  subscription
});

export default rootReducer;
