/* eslint-disable */

import React from 'react'

import Utils from '../../../helpers/utils'

import Header from '../../../components/Header'
import ScrollImage from '../../../styles/images/mouse-scroll.png'

class PageHeader extends React.Component {
  render () {
    return (
      <div className='programme-header dk-white'>
        <Header />
        <div className='content-wraper text-center'>
          <h1 className='programme-title'>
            Our PageHeader
            </h1>
          <hr className='dk-gb-white programme-hr' />
          <div>
            <h3 className='programme-sub-title'>
              Sharpen Your Saw for PSLE
              </h3>
          </div>
          <div className='programme-btn'>
            <button className='btn dk-btn dk-bg-blue' data-toggle='modal' data-target='#loginModal' onClick={() => Utils.redirect('/subscribe')}>
              START A FREE TRIAL
              </button>
          </div>
          <a href='javascript: void(0);' onClick={() => this.props.scrollTo()}>
            <img className='mouse-scroll' src={ScrollImage} />
          </a>
        </div>
      </div>
    )
  }
}

PageHeader.propTypes = {
  scrollTo: React.PropTypes.func.isRequired
}

export default PageHeader
