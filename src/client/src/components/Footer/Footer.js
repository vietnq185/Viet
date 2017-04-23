/* eslint-disable */
import React from 'react'
import { IndexLink, Link } from 'react-router'
import { fadeIn } from 'react-animations'
import { StyleSheet, css } from 'aphrodite'

import API from '../../helpers/api'
import Utils from '../../helpers/utils'

import './Footer.css'

import LeftBGSpecialOffer from '../../styles/images/left-bg-special-offer.png'

export default class Footer extends React.Component {
  constructor(props) {
    super(props)
    this.numberOfsubscriptions = 0
    this.state = {
      show: true,
      cntSubscriptions: Utils.copy(this.numberOfsubscriptions)
    }
  }
  componentDidMount() {
    var self = this
    API.countSubscriptions().then((cntSubscriptions) => this.setState({ cntSubscriptions })).catch((error) => {
      self.setState({ cntSubscriptions: Utils.copy(self.numberOfsubscriptions) })
    })
  }
  render() {
    if (this.state.cntSubscriptions > 20) {
      this.state.show = false
    }
    return (
      <div className={['page-footer text-left', (this.state.show ? 'mb6' : '')].join(' ')}>
        < div className= 'container-fluid' >
          <div className='row'>
            <div className='col-md-6 col-xs-12 col-md-push-6 footer-follow'>
              {/* <span>
            Follow us on
                    <i class="fa fa-fw fa-facebook dk-blue" aria-hidden="true"></i>
            <i class="fa fa-fw fa-twitter dk-blue1" aria-hidden="true"></i>
            <i class="fa fa-fw fa-linkedin-square dk-blue2" aria-hidden="true"></i>
          </span> */}
            </div>
            <div className='col-md-6 col-xs-12 col-md-pull-6 footer-action'>
              <div className='footer-group-item'>
                <div className='footer-item'><a href='javascript: void(0);'>About us</a></div>
                <div className='footer-item'><a href='javascript: void(0);'>Contact us</a></div>
                <div className='footer-item'><a href='javascript: void(0);'>Terms of Service</a></div>
                <div className='footer-item'><a href='javascript: void(0);'>Privacy</a></div>
              </div>
              <div className='footer-copyright'>
                <span>2016 <i className='fa fa-fw fa-copyright' /> Copyright by A-SLS. All rights Reserved.</span>
              </div>
            </div>
          </div>
          <div className={['banner-discount-container hidden-xs', (this.state.show ? '' : 'hide')].join(' ')}>
            <nav className='navbar-fixed-bottom'>
              <div className='banner-discount'>
                <span className='left-bg-special-offer'><img src={LeftBGSpecialOffer} /></span>
                <span className='banner-discount-info'>
                  Discount 20% for the first 200 subscriptions
								<Link to='/subscribe' className='btn dk-bg-green dk-white ml2'>Subscribe Now</Link>
                </span>
                <span><a className='close' onClick={() => this.setState({ show: false })}>&times;</a></span>
              </div>
            </nav>
          </div>
        </div >
      </div >
    )
  }
}

