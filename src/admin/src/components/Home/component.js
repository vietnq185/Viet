import React from 'react';

export default class Component extends React.Component {
  render() {
    console.info('Home components => props: ', this.props);
    return (
      <div>
        Home
      </div>
    );
  }
}