import React from 'react';

export default class Component extends React.Component {
  render() {
    console.info('Subscriptions components => props: ', this.props);
    return (
      <div>
        Subscriptions
      </div>
    );
  }
}