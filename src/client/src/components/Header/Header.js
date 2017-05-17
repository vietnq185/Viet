/* eslint-disable */

import React from 'react'
import { fadeIn } from 'react-animations'
import { StyleSheet, css } from 'aphrodite'
import { connect } from 'react-redux'
import { IndexLink, Link } from 'react-router'

import { Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';

import * as authActions from '../../store/auth'
import * as subscribeActions from '../../routes/Subscribe/modules/subscribe'

import Utils from '../../helpers/utils'

import './Header.css'

const styles = StyleSheet.create({
  fadeIn: {
    animationName: fadeIn,
    animationDuration: '1s'
  }
})

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFreeTrialConfirmStudent: false,
      showFreeTrialConfirm: false,
      showFreeTrialConfirmSignin: false
    }
  }

  doLogout() {
    const self = this
    setTimeout(function () {
      const nextAction = () => {
        Utils.redirect('/')
      }
      self.props.logout(nextAction)
    }, 500);
  }

  onCreateParent() {
    this.props.changeStep(this.props.subscribe.steps.signUp) // eslint-disable-line
    Utils.redirect('/subscribe')
  }

  render() {
    const { auth } = this.props
    const isLoggedIn = auth && auth.isLoggedIn
    let userLink = ''
    let theLink = (<li className='signin'><a className='text-signin' href='javascript: void(0);' data-toggle='modal' data-target='#modalFreeTrialConfirmSignin' onClick={() => this.setState({ showFreeTrialConfirmSignin: true })}> <span className='side-nav-item dk-white'>Sign In</span></a></li>)
    let trialLink = (<li><a className='side-nav-item dk-white route--item' href='javascript: void(0);' data-toggle='modal' data-target='#modalFreeTrialConfirm' onClick={() => this.setState({ showFreeTrialConfirm: true })}>Free Trial</a></li>)
    if (isLoggedIn) {
      theLink = ''
      if (auth.jwt.isParent) {
        trialLink = (<li><Link to='/subscribe' className='side-nav-item dk-white route--item' activeClassName='route--active dk-yellow'>Free Trial</Link></li>)
      }

      let userInfo = (<span><i className='fa fa-user' /> {auth.user.firstName} {auth.user.lastName}</span>)
      userLink = (
        <NavDropdown title={userInfo} id="nav-dropdown" className='side-nav-item dk-white route--item'>
          <MenuItem href='/profile'>My Profile</MenuItem>
          <MenuItem href='/subscription'>My Subscriptions</MenuItem>
          <MenuItem onClick={() => this.doLogout()}>Logout</MenuItem>
        </NavDropdown>
      )
    }
    return (
      <div>
        <Navbar default fluid collapseOnSelect className='topmost navbar navbar-default dk-navbar'>
          <Navbar.Header className='navbar-header'>
            <Navbar.Brand>
              <IndexLink to='/' className='navbar-brand'>A-SLS</IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse className='navbar-right dk-white'>
            <ul className='nav navbar-nav side-nav'>
              <li><IndexLink to='/' className='side-nav-item dk-white route--item nav-home' activeClassName='route--active dk-yellow'>Home</IndexLink></li>
              <li><Link to='/programme' className='side-nav-item dk-white route--item' activeClassName='route--active dk-yellow'>Our Programme</Link></li>
              <li><Link to='/student' className='side-nav-item dk-white route--item' activeClassName='route--active dk-yellow'>For Student</Link></li>
              <li><Link to='/parent' className='side-nav-item dk-white route--item' activeClassName='route--active dk-yellow'>For Parent</Link></li>
              {trialLink}
              {userLink}
              {theLink}
            </ul>
          </Navbar.Collapse>
        </Navbar>
        {/* <!-- Modal --> */}
        <div id='modalFreeTrialConfirm' aria-hidden='false' className={['modal fade', this.state.showFreeTrialConfirm ? 'in' : '', css(styles.fadeIn)].join(' ')} role='dialog' style={this.state.showFreeTrialConfirm ? { display: 'block' } : { display: 'none' }}>
          <div className='modal-dialog'>
            {/* <!-- Modal content--> */}
            <div className='modal-content'>
              <div className='modal-header text-center'>
                <span className='modalFreeTrialConfirmTitle'>Free Trial</span>
                <button type='button' className='close' data-dismiss='modal' onClick={() => this.setState({ showFreeTrialConfirm: false })}>&times;</button>
              </div>
              <div className='modal-body'>
                <p className='text-center'>Are you a student or parent?</p><br />
                <div className='text-center'>
                  <a className='btn dk-bg-green dk-white mb5' onClick={() => this.setState({ showFreeTrialConfirm: false, showFreeTrialConfirmStudent: true })}>I AM A STUDENT</a>
                  <a className='btn dk-bg-blue dk-white mb5' href='javascript: void(0);' onClick={() => this.onCreateParent()}>I AM A PARENT</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='modalFreeTrialConfirmStudent' aria-hidden='false' className={['modal fade', this.state.showFreeTrialConfirmStudent ? 'in' : '', css(styles.fadeIn)].join(' ')} role='dialog' style={this.state.showFreeTrialConfirmStudent ? { display: 'block' } : { display: 'none' }}>
          <div className='modal-dialog'>
            {/* <!-- Modal content--> */}
            <div className='modal-content'>
              <div className='modal-header text-center'>
                <span className='modalFreeTrialConfirmTitle'>Free Trial</span>
                <button type='button' className='close' data-dismiss='modal' onClick={() => this.setState({ showFreeTrialConfirmStudent: false })}>&times;</button>
              </div>
              <div className='modal-body'>
                <p className='text-center'>Thank you for your interest! Please let your parents to create an account and signup ASLS for you!</p><br />
                <div className='text-center'>
                  <a className='btn dk-bg-green dk-white' href='javascript: void(0);' onClick={() => this.onCreateParent()}>PARENT? SIGNUP FOR A-SLS</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='modalFreeTrialConfirmSignin' aria-hidden='false' className={['modal fade', this.state.showFreeTrialConfirmSignin ? 'in' : '', css(styles.fadeIn)].join(' ')} role='dialog' style={this.state.showFreeTrialConfirmSignin ? { display: 'block' } : { display: 'none' }}>
          <div className='modal-dialog'>
            {/* <!-- Modal content--> */}
            <div className='modal-content'>
              <div className='modal-header text-center'>
                <span className='modalFreeTrialConfirmTitle'>Sign In</span>
                <button type='button' className='close' data-dismiss='modal' onClick={() => this.setState({ showFreeTrialConfirmSignin: false })}>&times;</button>
              </div>
              <div className='modal-body'>
                <p className='text-center'>Are you a student or parent?</p><br />
                <div className='text-center'>
                  <a className='btn dk-bg-green dk-white mb5' href='https://app.a-smartlearning.com/en/sml/login'>I AM A STUDENT</a>
                  <a className='btn dk-bg-blue dk-white mb5' href='/subscribe'>I AM A PARENT</a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

const mapDispatchToProps = {
  ...authActions,
  ...subscribeActions
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  subscribe: state.subscribe
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
