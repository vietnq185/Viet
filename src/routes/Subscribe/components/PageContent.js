import React from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup' // eslint-disable-line
import { IndexLink } from 'react-router'

import StepNav from './StepNav'
import Step1SignIn from './Step1SignIn'
import Step1SignUp from './Step1SignUp'
import Step2Plan from './Step2Plan'
import Step3Payment from './Step3Payment'
import Step4CreateStudent from './Step4CreateStudent'
import Step4LinkStudent from './Step4LinkStudent'

import Utils from '../../../helpers/utils'

class PageContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { step, steps } = this.props

    console.info('Subscribe => PageContent component => props: ', this.props)

    const viewMap = {}

    viewMap[steps.signIn] = (<Step1SignIn key={Utils.guid()} {...this.props} />)
    viewMap[steps.signUp] = (<Step1SignUp key={Utils.guid()} {...this.props} />)
    viewMap[steps.plan] = (<Step2Plan key={Utils.guid()} {...this.props} />)
    viewMap[steps.payment] = (<Step3Payment key={Utils.guid()} {...this.props} />)
    viewMap[steps.createStudent] = (<Step4CreateStudent key={Utils.guid()} {...this.props} />)
    viewMap[steps.linkStudent] = (<Step4LinkStudent key={Utils.guid()} {...this.props} />)

    const stepContent = viewMap[step]

    return (
      <div className='subscribe-wrapper'>
        <div className='breadcrumb'>
          <IndexLink to='/' className='passed'>Home</IndexLink> <i className='fa fa-chevron-right' />
          <span className='active'>Subscribe</span>
        </div>
        <div className='subscribe-content-container'>
          <h3>Complete your subscription in just a few steps</h3>
          <div className='subscribe-content'>

            <StepNav {...this.props} />

            {/* <CSSTransitionGroup transitionName='subscribe'>{stepContent}</CSSTransitionGroup> */}

            {stepContent}

          </div>
        </div>
      </div>
    )
  }
}

PageContent.propTypes = {
  step: React.PropTypes.string.isRequired,
  steps: React.PropTypes.object.isRequired
}

export default PageContent
