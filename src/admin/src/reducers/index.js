// @flow
import { combineReducers } from 'redux';

import auth from './auth';
import user from './user';
import subscription from './subscription';
import option from './option';

const rootReducer = combineReducers({
  auth,
  user,
  subscription,
  option
});

export default rootReducer;
