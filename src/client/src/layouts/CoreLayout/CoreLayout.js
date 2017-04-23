import React from 'react'
import { RouteTransition } from 'react-router-transition'

import './CoreLayout.css'

export const CoreLayout = ({ children, location }) => (
  <div className='core-layout__viewport'>
    <RouteTransition
      pathname={location.pathname}
      atEnter={{ opacity: 0 }}
      atLeave={{ opacity: 1 }}
      atActive={{ opacity: 1 }}>{children}</RouteTransition>
  </div>
)

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
  location: React.PropTypes.object.isRequired
}

export default CoreLayout
