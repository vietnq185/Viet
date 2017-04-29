import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import DefaultRoute from './default.route';
import AuthRoute from './auth.route';

import { FrontLayouts } from '../components/Layouts';

const routePrefix = process.env.REACT_APP_ROUTE_PREFIX;

const RedirectToAdmin = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (<Redirect to={`${routePrefix}`} {...props} />)} />
  )
};

export default (props) => {
  return (
    <Switch>
      <RedirectToAdmin exact path="/" component={FrontLayouts.Home} />
      <DefaultRoute exact path={`${routePrefix}`} component={FrontLayouts.Home} />
      <DefaultRoute exact path={`${routePrefix}/`} component={FrontLayouts.Home} />
      <DefaultRoute exact path={`${routePrefix}/product`} component={FrontLayouts.Product} />
      <DefaultRoute exact path={`${routePrefix}/product/:productId`} component={FrontLayouts.Product} />
      {/*<DefaultRoute exact path="/product/:productId" component={FrontLayouts.ProductDetail} />*/}
      <AuthRoute path={`${routePrefix}/login`} component={FrontLayouts.Login} />
      <AuthRoute path={`${routePrefix}/profile`} component={FrontLayouts.Profile} />
      <DefaultRoute component={FrontLayouts.NotFound} />
    </Switch>
  );
};
