import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'cancel-subscription/:id',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const CancelSubscription = require('./containers/CancelSubscriptionContainer').default
      const reducer = require('./modules/CancelSubscription').default

      /*  Add the reducer to the store on key 'student'  */
      injectReducer(store, { key: 'CancelSubscription', reducer })

      /*  Return getComponent   */
      cb(null, CancelSubscription)

    /* Webpack named bundle   */
    }, 'cancel-subscription-id')
  }
})
