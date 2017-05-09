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
    this.showBannerDiscount = {}
    this.state = {
      show: false,
      showBannerDiscount: Utils.copy(this.showBannerDiscount)
    }
  }
  componentDidMount() {
    var self = this
    API.checkToShowBannerDiscount().then((showBannerDiscount) => this.setState({ showBannerDiscount })).catch((error) => {
      self.setState({ showBannerDiscount: Utils.copy(self.showBannerDiscount) })
    })
  }
  render() {
    let showPromotionBanner = this.state.show;
    if (this.state.showBannerDiscount.showBanner === 1) {
      showPromotionBanner = true;
    }
    if (this.props.auth.isLoggedIn) {
      showPromotionBanner = false;
    }

    return (
      <div className={['page-footer text-left', (showPromotionBanner ? 'mb6' : '')].join(' ')}>
        < div className='container-fluid' >
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
          <div className={['banner-discount-container', (showPromotionBanner ? '' : 'hide')].join(' ')}>
            <nav className='navbar-fixed-bottom'>
              <div className='banner-discount'>
                <span className='left-bg-special-offer'><img src={LeftBGSpecialOffer} /></span>
                <span className='banner-discount-info'>
                  <span className='banner-discount-text'>
                    Discount {this.state.showBannerDiscount.discount}% for the first {this.state.showBannerDiscount.limit} subscriptions
								<Link to='/subscribe' className='btn dk-bg-green dk-white ml2'>Subscribe Now</Link>
                  </span>
                  <span className='banner-discount-close'><a className='close' onClick={() => this.setState({ show: false })}>&times;</a></span>
                </span>
              </div>
            </nav>
          </div>
        </div >
      </div >
    )
  }
}

