import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: '/subscribe',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Subscribe = require('./containers/SubscribeContainer').default
      const reducer = require('./modules/subscribe').default

      // ---------------------------------------------------------
      const { restart } = require('./modules/subscribe')
      store.dispatch(restart())
      // ---------------------------------------------------------

      /*  Add the reducer to the store on key 'subscribe'  */
      injectReducer(store, { key: 'subscribe', reducer })

      /*  Return getComponent   */
      cb(null, Subscribe)

      /* Webpack named bundle   */
    }, 'subscribe')
  }
})

export const signUpRoute = (store) => ({
  path: '/subscribe/signUp',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Subscribe = require('./containers/SubscribeContainer').default
      const reducer = require('./modules/subscribe').default

      /*  Add the reducer to the store on key 'subscribe'  */
      injectReducer(store, { key: 'subscribe', reducer })

      // ---------------------------------------------------------
      // const state = store.getState()
      // const { changeStep, STEPS } = require('./modules/subscribe')
      // console.info('state in route => state: ', state)
      // console.info('state in route => nextState: ', nextState)
      const { restart, changeStep, STEPS } = require('./modules/subscribe')
      store.dispatch(restart())
      store.dispatch(changeStep(STEPS.signUp))
      // ---------------------------------------------------------

      /*  Return getComponent   */
      cb(null, Subscribe)

      /* Webpack named bundle   */
    }, 'subscribe_step')
  }
})
