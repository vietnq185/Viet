import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Grid, Navbar, Jumbotron } from 'react-bootstrap';

import * as authActions from '../../reducers/auth';

import Utils from '../../helpers/utils';

import './front.default.layout.css';

const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = {
  ...authActions
};

class HeaderComponent extends React.Component {

  loginLink() {
    return (<li><NavLink className="menu-item" activeClassName="selected-menu-item" to={`${Utils.adminLink('/login')}`}>Login</NavLink></li>);
  }

  logoutLink() {
    return (<li onClick={() => this.logout()}><NavLink className="menu-item" activeClassName="selected-menu-item" to={`${Utils.adminLink('/')}`}>Logout</NavLink></li>);
  }

  logout = () => {
    const self = this;
    const nextAction = () => {
      self.props.history.push(`${Utils.adminLink('/')}`);
    }
    self.props.logout(nextAction);
  }

  render() {
    const { auth: { isLoggedIn } } = this.props;
    const theLink = !isLoggedIn ? this.loginLink() : this.logoutLink();
    return (
      <Navbar inverse fixedTop>

        <Navbar.Header>
          <Navbar.Brand>
            <a href={`${Utils.adminLink('/')}`}>ASLS</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <ul className="nav navbar-nav pull-right">
          <li><NavLink className="menu-item" activeClassName="selected-menu-item" to={`${Utils.adminLink('/')}`} exact>Home</NavLink></li>
          <li><NavLink className="menu-item" activeClassName="selected-menu-item" to={`${Utils.adminLink('/subscriptions')}`} exact>Subscriptions</NavLink></li>
          <li><NavLink className="menu-item" activeClassName="selected-menu-item" to={`${Utils.adminLink('/users')}`} exact>Users</NavLink></li>
          {theLink}
        </ul>
      </Navbar >
    )
  }
}

const Header = withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderComponent));

export default class DefaultLayout extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Jumbotron>
          <Grid className="page-container">
            {this.props.children}
          </Grid>
        </Jumbotron>
      </div>
    )
  }
}
