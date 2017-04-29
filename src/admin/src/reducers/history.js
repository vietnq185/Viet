import browserHistory from 'history/createBrowserHistory';

const initialState = browserHistory();

export default (state = initialState, action) => {
  return state;
}
