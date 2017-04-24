import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'upgrade-subscription/:id',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const UpgradeSubscription = require('./containers/UpgradeSubscriptionContainer').default
      const reducer = require('./modules/UpgradeSubscription').default

      /*  Add the reducer to the store on key 'student'  */
      injectReducer(store, { key: 'UpgradeSubscription', reducer })

      /*  Return getComponent   */
      cb(null, UpgradeSubscription)

    /* Webpack named bundle   */
    }, 'upgrade-subscription-id')
  }
})
