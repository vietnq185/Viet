import React from 'react';
import { Redirect } from 'react-router-dom';

import Utils from '../../helpers/utils';

export default class Component extends React.Component {
  render() {
    console.info('Home components => props: ', this.props);
    return (<Redirect to={Utils.adminLink('/subscriptions')} />);
  }
}