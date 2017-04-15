import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'subscription',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Subscription = require('./containers/SubscriptionContainer').default
      const reducer = require('./modules/subscription').default

      /*  Add the reducer to the store on key 'subscription'  */
      injectReducer(store, { key: 'subscription', reducer })

      /*  Return getComponent   */
      cb(null, Subscription)

    /* Webpack named bundle   */
    }, 'subscription')
  }
})
