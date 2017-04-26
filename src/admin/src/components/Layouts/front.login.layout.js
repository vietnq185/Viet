import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  render() {
    const routePrefix = process.env.REACT_APP_ROUTE_PREFIX;
    return (
      <div>
        <div>Header</div>
        <ul>
          <li><Link to={`${routePrefix}/`}>Home</Link></li>
          <li><Link to={`${routePrefix}/product`}>Products</Link></li>
          <li><Link to={`${routePrefix}/login`}>Login</Link></li>
          <li><Link to={`${routePrefix}/profile`}>Profile</Link></li>
        </ul>
      </div>
    )
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div>Footer</div>
    )
  }
}

export default class LoginLayout extends React.Component {
  render() {
    return (
      <div>
        <div>LoginLayout</div>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}
