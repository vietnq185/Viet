import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'parent',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Parent = require('./containers/ParentContainer').default
      const reducer = require('./modules/parent').default

      /*  Add the reducer to the store on key 'parent'  */
      injectReducer(store, { key: 'parent', reducer })

      /*  Return getComponent   */
      cb(null, Parent)

    /* Webpack named bundle   */
    }, 'parent')
  }
})
