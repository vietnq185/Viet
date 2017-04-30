import React from 'react';

import DefaultLayout from './front.default.layout';

import NotFoundComponent from '../NotFound';
import HomeComponent from '../Home';
import LoginComponent from '../Login';

import SubscriptionsComponent from '../Subscriptions';
import UsersComponent from '../Users';
import OptionsComponent from '../Options';

// ------------------------------------------------------------------------------------------------------

export const NotFound = (props) => {
  return (
    <DefaultLayout>
      <NotFoundComponent />
    </DefaultLayout>
  );
};

// ------------------------------------------------------------------------------------------------------

export const Home = (props) => {
  return (
    <DefaultLayout>
      <HomeComponent />
    </DefaultLayout>
  );
};

// ------------------------------------------------------------------------------------------------------

export const Login = (props) => {
  return (
    <DefaultLayout>
      <LoginComponent />
    </DefaultLayout>
  );
};
// ------------------------------------------------------------------------------------------------------

export const Subscriptions = (props) => {
  return (
    <DefaultLayout>
      <SubscriptionsComponent />
    </DefaultLayout>
  );
};

// ------------------------------------------------------------------------------------------------------

export const Users = (props) => {
  return (
    <DefaultLayout>
      <UsersComponent />
    </DefaultLayout>
  );
};

// ------------------------------------------------------------------------------------------------------

export const Options = (props) => {
  return (
    <DefaultLayout>
      <OptionsComponent />
    </DefaultLayout>
  );
};

