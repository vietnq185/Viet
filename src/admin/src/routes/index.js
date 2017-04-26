import React from 'react';
import { Switch } from 'react-router-dom';

import DefaultRoute from './default.route';
import AuthRoute from './auth.route';

import { FrontLayouts } from '../components/Layouts';

export default (props) => {
  const routePrefix = process.env.REACT_APP_ROUTE_PREFIX;
  return (
    <Switch>
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
