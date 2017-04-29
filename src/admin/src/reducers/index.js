// @flow
import { combineReducers } from 'redux';

import auth from './auth';
import subscription from './subscription';

const rootReducer = combineReducers({
  auth,
  subscription
});

export default rootReducer;
