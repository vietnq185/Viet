/* eslint-disable */

import React from 'react'
import { connect } from 'react-redux'

import Utils from '../../../helpers/utils'
import { fadeIn } from 'react-animations'
import { StyleSheet, css } from 'aphrodite'
import CaculatorImage from '../../../styles/images/caculator.svg'
import MicroscopeImage from '../../../styles/images/microscope.svg'

import ConceptmapImage from '../../../styles/images/conceptmap.png'
import EstimationImage from '../../../styles/images/estimation.png'
import WorksheetImage from '../../../styles/images/worksheet.png'
import ReportImage from '../../../styles/images/report.png'

import * as subscribeActions from '../../Subscribe/modules/subscribe'

const styles = StyleSheet.create({
  fadeIn: {
    animationName: fadeIn,
    animationDuration: '1s'
  }
})

class PageContent extends React.Component {
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
      <div>

        <div className='programme-section1 text-left'>
          <div className='container-fluid'>
            {/* <!-- Page Section1 --> */}
            <div className='row programme-container'>
              <div className='container-fluid'>
                <div className='col-md-6'>
                  <div className='row'>
                    <div className='col-md-2'>
                      <img src={CaculatorImage} alt='Caculator' />
                    </div>
                    <div className='col-md-10 text-map'>
                      <p className='discription-tittle'>PSLE MATHEMATICS</p>
                      <p className='discription-sub'>Preparation</p>
                    </div>
                  </div>
                  <div className='discription-group-item'>
                    <p className='discription-item mb'>Singapore MOE Latest Syllabus</p>
                    <p className='discription-item mb'>
                      <span className='dk-blue'>78&nbsp;</span>Concepts in Mathematics Concept System</p>
                    <p className='discription-item mb'>Big Questions Bank in the 78 Concepts</p>
                    <p className='discription-item mb'>Each Concept has Questions of Various Difficulty Levels and Diverse Heuristic Methods</p>
                    <p className='discription-item'>Subscribable for Primary 5 & 6 Students</p>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='row'>
                    <div className='col-md-2'>
                      <img src={MicroscopeImage} alt='MicroScope' />
                    </div>
                    <div className='col-md-10 text-map'>
                      <p className='discription-tittle'>PSLE SCIENCE</p>
                      <p className='discription-sub'>Preparation</p>
                    </div>
                  </div>
                  <div className='discription-group-item'>
                    <p className='discription-item mb'>Singapore MOE Latest Syllabus</p>
                    <p className='discription-item mb'>
                      <span className='dk-blue'>71&nbsp;</span>Concepts in Sience Concept System</p>
                    <p className='discription-item mb'>Big Questions Bank in the 71 Concepts</p>
                    <p className='discription-item mb'>Each Concept has Questions of Various Higher-order Thinking and Skills and Processes</p>
                    <p className='discription-item'>Subscribable for Primary 5 & 6 Students</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- /.row --> */}
          </div>
          {/* <!-- /.container-fluid --> */}
        </div>
        {/* <!--/.page-section1--> */}

        {/* <!-- page-section2--> */}
        <div className='programme-section2 text-center'>
          <h3 className='dk-blue-text section2-text-header'>
            Our Free Features
      </h3>
          <div className='row text-left'>
            <div className='col-md-6'>
              <div>
                <img className='product-icon' src={ConceptmapImage} alt='ConceptMap' />
                <span className='dk-blue-text programme-product'>Concept Map</span>
              </div>
              <p className='programme-description'>
                Our Concept Map highlights the individual student's strengths and areas for improvement in all concepts and sub-concepts in both PSLE Mathematics and Science
          </p>
            </div>
            <div className='col-md-6'>
              <div>
                <img className='product-icon' src={EstimationImage} alt='Estimation' />
                <span className='dk-blue-text programme-product'>Academic Ability Estimation</span>
              </div>
              <p className='programme-description'>
                Our algorithm dynamically identifies every single practice that a student attempts and estimates his/her academic ability based on his/her latest performance
          </p>
            </div>
          </div>
          <div className='row text-left'>
            <div className='col-md-6'>
              <div>
                <img className='product-icon' src={WorksheetImage} alt='WorkSheet' />
                <span className='dk-blue-text programme-product'>Individualised Worksheet</span>
              </div>
              <p className='programme-description'>
                Every worksheet assigned to the student is individualised and generated by the algorithm based on the result of his/her latest academic ability estimation
          </p>
            </div>
            <div className='col-md-6'>
              <div>
                <img className='product-icon' src={ReportImage} alt='Report' />
                <span className='dk-blue-text programme-product'>Visual Reports</span>
              </div>
              <p className='programme-description'>
                Timely and accurate reports displayed in the form of bar graphs and texts are sent to the student and parent
          </p>
            </div>
          </div>
        </div>
        {/* <!--/.page-section2--> */}

        {/* !-- page-section3--> */}
        <div className='programme-section3 text-center dk-bg-gray'>
          <div>
            <h3 className='dk-blue1 tree-trial'>
              Join our learning group today!
        </h3>
            <button className='btn dk-btn dk-bg-blue dk-white' data-toggle='modal' data-target='#modalFreeTrialConfirm' onClick={() => this.setState({ showFreeTrialConfirm: true })}>
              START A FREE TRIAL
        </button>
          </div>
          <div className='section3-paging'>
            <div className='section3-paging-item dk-bg-green' />
            <div className='section3-paging-item dk-bg-gray' />
            <div className='section3-paging-item dk-bg-gray' />
            <div className='section3-paging-item dk-bg-gray' />
          </div>
        </div>
        {/* <!--/.page-section3--> */}

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

PageContent.propTypes = {}

const mapDispatchToProps = {
  ...subscribeActions
}

const mapStateToProps = (state) => ({
  subscribe: state.subscribe
})

export default connect(mapStateToProps, mapDispatchToProps)(PageContent)
