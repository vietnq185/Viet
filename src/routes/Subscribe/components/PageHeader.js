/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import { IndexLink, Link } from 'react-router'

import { Nav, NavItem, Navbar } from 'react-bootstrap';

import * as authActions from '../../../store/auth'

import Utils from '../../../helpers/utils'

import './PageHeader.scss'

class PageHeader extends React.Component {
  doLogout() {
    const self = this
    setTimeout(function () {
      const nextAction = () => {
        Utils.redirect('subscribe')
      }
      self.props.logout(nextAction)
    }, 500);
  }

  render() {
    const { auth } = this.props
    const isLoggedIn = auth && auth.isLoggedIn
    let subscriptionLink = ''
    let theLink = (<li className='signin'><a href='https://app.a-smartlearning.com/en/sml/login' className='text-signin'> <span className='side-nav-item'>Sign In</span></a></li>)
    if (isLoggedIn) {
      theLink = (<li><a href='javascript: void(0);' className='side-nav-item route--link' onClick={() => this.doLogout()}>Logout</a></li>)
      if (auth.jwt.isParent) {
        subscriptionLink = (<li><Link to='/subscription' className='side-nav-item route--link' activeClassName='route--link--active dk-yellow'>My Subscriptions</Link></li>)
      }
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
              <li><Link to='/programme' className='side-nav-item dk-white route--link' activeClassName='route--link--active dk-yellow'>Our Programme</Link></li>
              <li><Link to='/student' className='side-nav-item dk-white route--link' activeClassName='route--link--active dk-yellow'>For Student</Link></li>
              <li><Link to='/parent' className='side-nav-item dk-white route--link' activeClassName='route--link--active dk-yellow'>For Parent</Link></li>
              <li><Link to='/subscribe' className='side-nav-item dk-white route--link' activeClassName='route--link--active dk-yellow'>Free Trial</Link></li>
              {subscriptionLink}
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
