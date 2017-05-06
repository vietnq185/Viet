import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'

import './styles/index.css'
import './styles/main.css'
import './styles/col-mixin.css'

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
const initialState = window.___INITIAL_STATE__
const store = createStore(initialState)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// Go!
// ========================================================
render()
