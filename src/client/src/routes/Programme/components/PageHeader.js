/* eslint-disable */

import React from 'react'
import { connect } from 'react-redux'
import { fadeIn } from 'react-animations'
import { StyleSheet, css } from 'aphrodite'

import Utils from '../../../helpers/utils'

import Header from '../../../components/Header'
import ScrollImage from '../../../styles/images/mouse-scroll.png'

import * as subscribeActions from '../../Subscribe/modules/subscribe'

const styles = StyleSheet.create({
  fadeIn: {
    animationName: fadeIn,
    animationDuration: '1s'
  }
})

class PageHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFreeTrialConfirmStudent: false,
      showFreeTrialConfirm: false
    }
  }

  onCreateParent() {
    this.props.changeStep(this.props.subscribe.steps.signUp) // eslint-disable-line
    Utils.redirect('/subscribe')
  }

  render() {
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
            <button className='btn dk-btn dk-bg-blue' data-toggle='modal' data-target='#modalFreeTrialConfirm' onClick={() => this.setState({ showFreeTrialConfirm: true })}>
              START A FREE TRIAL
              </button>
          </div>
          <a href='javascript: void(0);' onClick={() => this.props.scrollTo()}>
            <img className='mouse-scroll' src={ScrollImage} />
          </a>
        </div>

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
                  <a className='btn dk-bg-green dk-white mb5' data-dismiss='modal' data-toggle='modal' data-target='#modalFreeTrialConfirmStudent' onClick={() => this.setState({ showFreeTrialConfirm: false, showFreeTrialConfirmStudent: true })}>I AM A STUDENT</a>
                  <a className='btn dk-bg-blue dk-white mb5' href='/subscribe'>I AM A PARENT</a>
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

      </div>
    )
  }
}

PageHeader.propTypes = {
  scrollTo: React.PropTypes.func.isRequired
}

const mapDispatchToProps = {
  ...subscribeActions
}

const mapStateToProps = (state) => ({
  subscribe: state.subscribe
})

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader)
