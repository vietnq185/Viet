import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : '*',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const NotFound = require('./containers/NotFoundContainer').default
      const reducer = require('./modules/NotFound').default

      /*  Add the reducer to the store on key 'NotFound'  */
      injectReducer(store, { key: 'NotFound', reducer })

      /*  Return getComponent   */
      cb(null, NotFound)

    /* Webpack named bundle   */
    }, 'NotFound')
  }
})
