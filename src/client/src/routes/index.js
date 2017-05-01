// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import CounterRoute from './Counter'
import ProgrammeRoute from './Programme'
import StudentRoute from './Student'
import ParentRoute from './Parent'
import SubscribeRoute from './Subscribe'
import SubscriptionRoute from './Subscription'
import SubscriptionDetailsRoute from './SubscriptionDetails'
import UpgradeSubscriptionRoute from './UpgradeSubscription'
import CancelSubscriptionRoute from './CancelSubscription'
import ForgotPasswordRoute from './ForgotPassword'
import NotFoundRoute from './NotFound'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Home,
  childRoutes: [
    CounterRoute(store),
    ProgrammeRoute(store),
    StudentRoute(store),
    ParentRoute(store),
    SubscribeRoute(store),
    SubscriptionRoute(store),
    SubscriptionDetailsRoute(store),
    UpgradeSubscriptionRoute(store),
    CancelSubscriptionRoute(store),
    ForgotPasswordRoute(store),
    NotFoundRoute(store)
  ]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
