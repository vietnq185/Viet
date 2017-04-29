import React from 'react';

export default class Component extends React.Component {
  render() {
    console.info('Users components => props: ', this.props);
    return (
      <div>
        Users
      </div>
    );
  }
}