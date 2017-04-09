import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Footer.scss'

export const Footer = () => (
  <div className='page-footer text-left'>
    <div className='container-fluid'>
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
    </div>
  </div>
)

export default Footer
