/* eslint-disable */

import React from 'react'
import { connect } from 'react-redux'
import { IndexLink, Link } from 'react-router'

import { Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';

import * as authActions from '../../../store/auth'

import Utils from '../../../helpers/utils'

import './PageHeader.css'

class PageHeader extends React.Component {
  doLogout() {
    const self = this
    setTimeout(function () {
      const nextAction = () => {
        Utils.redirect('/subscribe')
      }
      self.props.logout(nextAction)
    }, 500);
  }

  render() {
    const { auth } = this.props
    const isLoggedIn = auth && auth.isLoggedIn
    let userLink = ''
    let theLink = (<li className='signin'><a href='https://app.a-smartlearning.com/en/sml/login' className='text-signin'> <span className='side-nav-item'>Sign In</span></a></li>)
    if (isLoggedIn) {
      theLink = ''
      let userInfo = (<span><i className='fa fa-user' /> {auth.user.firstName} {auth.user.lastName}</span>)
      userLink = (
        <NavDropdown title={userInfo} id="nav-dropdown" className='side-nav-item dk-white route--item'>
          <MenuItem href='/subscription'>My Subscriptions</MenuItem>
          <MenuItem onClick={() => this.doLogout()}>Logout</MenuItem>
        </NavDropdown>
      )
    }
    return (
      <div className='subscribe-header'>
        <Navbar default collapseOnSelect className='topmost navbar navbar-default dk-navbar'>
          <Navbar.Header className='navbar-header'>
            <Navbar.Brand>
              <IndexLink to='/' className='subscribe-navbar-brand'>A-SLS</IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse className='navbar-collapse navbar-ex1-collapse navbar-right dk-white'>
            <ul className='nav navbar-nav side-nav'>
              <li><Link to='/about' className='side-nav-item dk-white route--link' activeClassName='route--link--active dk-yellow'>Home</Link></li>
              <li><Link to='/programme' className='side-nav-item dk-white route--link' activeClassName='route--link--active dk-yellow'>Our Programme</Link></li>
              <li><Link to='/student' className='side-nav-item dk-white route--link' activeClassName='route--link--active dk-yellow'>For Student</Link></li>
              <li><Link to='/parent' className='side-nav-item dk-white route--link' activeClassName='route--link--active dk-yellow'>For Parent</Link></li>
              <li><Link to='/subscribe' className='side-nav-item dk-white route--link' activeClassName='route--link--active dk-yellow'>Free Trial</Link></li>
              {userLink}
              {theLink}
            </ul>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}

PageHeader.propTypes = {
  scrollTo: React.PropTypes.func.isRequired
}

const mapDispatchToProps = {
  ...authActions
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader)
