import React from 'react';
import { Grid, Button } from 'react-bootstrap';

const routePrefix = process.env.REACT_APP_ROUTE_PREFIX;

export default class Profile extends React.Component {

  logout = () => {
    var self = this;
    const nextAction = () => {
      self.props.history.push(`${routePrefix}`);
    }
    self.props.logout(nextAction);
  }

  render() {
    console.info('Profile components => props: ', this.props);

    return (
      <Grid>
        <h1>Welcome to React</h1>
        <p>
          Profile page
        </p>
        <Button bsStyle="success" onClick={this.logout}>Signout</Button>
      </Grid>
    );
  }

}