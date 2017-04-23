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

      /*  Add the reducer to the store on key 'subscribe'  */
      injectReducer(store, { key: 'subscribe', reducer })

      /*  Return getComponent   */
      cb(null, Subscribe)

      /* Webpack named bundle   */
    }, 'subscribe')
  }
})
