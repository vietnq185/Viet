import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Utils from '../helpers/utils';

import DefaultRoute from './default.route';
import AuthRoute from './auth.route';

import { FrontLayouts } from '../components/Layouts';

const RedirectToAdmin = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (<Redirect to={`${Utils.adminLink('')}`} {...props} />)} />
  )
};

export default (props) => {
  return (
    <Switch>
      <RedirectToAdmin exact path="/" component={FrontLayouts.Home} />
      <AuthRoute exact path={`${Utils.adminLink('')}`} component={FrontLayouts.Home} />
      <AuthRoute exact path={`${Utils.adminLink('/')}`} component={FrontLayouts.Home} />
      <AuthRoute path={`${Utils.adminLink('/login')}`} component={FrontLayouts.Login} />
      <AuthRoute exact path={`${Utils.adminLink('/subscriptions')}`} component={FrontLayouts.Subscriptions} />
      <AuthRoute exact path={`${Utils.adminLink('/users')}`} component={FrontLayouts.Users} />
      <DefaultRoute component={FrontLayouts.NotFound} />
    </Switch>
  );
};
