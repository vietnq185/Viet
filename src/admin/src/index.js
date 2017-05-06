// @flow
import React from 'react';
import { render } from 'react-snapshot';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from 'react-router';

import configureStore from './store/configureStore';

import Utils from './helpers/utils';

import * as authActions from './reducers/auth';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.css';

import './styles/index.css';

import Routes from './routes';

// ========================================================
// Check to support on all devices
// ========================================================
if (typeof Object.keys === 'undefined') {
  Object.keys = (obj) => {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }

    return keys;
  };
}
if (typeof Object.values === 'undefined') {
  Object.values = (obj) => {
    var values = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        values.push(obj[i]);
      }
    }

    return values;
  };
}

// ========================================================
// Disable console.* on production
// ========================================================
if (process.env.NODE_ENV !== 'development') {
  const disableConsole = () => {
    if (typeof console !== 'undefined') {
      for (var i in console) {
        if (console.hasOwnProperty(i) && typeof console[i] === 'function') {
          // Override function so that it will do nothing
          console[i] = () => { };
        }
      }
    }
  }
  //
  disableConsole();
  //
}

// ========================================================
// Store Instantiation
// ========================================================
const store = configureStore();

store.dispatch(authActions.checkTokensAtStartUp());

// -------------------------------------------------------------------

const BindRedirect = withRouter((props) => {
  // define Utils.redirect function, so that we can use it later
  Utils.redirect = (path = '/') => {
    if (props.history) {
      props.history.push(path);
    }
  }
  //
  return (<span className="BindRedirect"></span>)
});

// -------------------------------------------------------------------

const Root = (props) => {
  return (
    <Provider store={props.store}>
      <Router>
        <div style={{ height: '100%' }}>
          <BindRedirect />
          <Routes />
          {props.children}
        </div>
      </Router>
    </Provider>
  );
}

// -------------------------------------------------------------------

render(<Root store={store} />, document.getElementById('root'));
