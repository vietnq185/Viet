/* eslint-disable */
import React from 'react'
import Utils from '../../../helpers/utils'
import API from '../../../helpers/api'
import * as authActions from '../../../store/auth'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import GoogleSurvey from './GoogleSurvey'

class PageContent extends React.Component {
  constructor(props) {
    super(props)
    this.initialSubscription = {}
    this.state = {
      id: this.props.params.id || '',
      subscription: Utils.copy(this.initialSubscription),
      step: 1,
      stepData: {
      }
    }
  }

  changeStep(step, data) {
    console.log('data: ', data)
    this.setState({
      step,
      stepData: Object.assign({}, this.state.stepData, data)
    })
  }

  componentDidMount() {
    var self = this
    return authActions.checkAccessToken().then((jwt) => {
      API.getSubscriptionDetails(jwt.accessToken || '', this.state.id).then((subscription) => this.setState({ subscription })).catch((error) => {
        console.info('what the error: ', error)
        self.setState({ subscription: Utils.copy(self.initialSubscription) })
      })
    }).catch((error) => {
      console.info('changeSubscriptionStatus => checkAccessToken => error: ', error)
    })
  }

  render() {
    if (this.props.auth.isLoggedIn) {
      const { step } = this.state;
      let content = Step1;
      switch (step) {
        case 1:
          content = <Step1 stepData={this.state.stepData} objSubscription={this.state.subscription} changeStep={this.changeStep.bind(this)} />;
          break;
        case 2:
          content = <Step2 stepData={this.state.stepData} objSubscription={this.state.subscription} changeStep={this.changeStep.bind(this)} />;
          break;
        case 3:
          content = <Step3 stepData={this.state.stepData} objSubscription={this.state.subscription} changeStep={this.changeStep.bind(this)} />;
          break;
        case 4:
          content = <GoogleSurvey stepData={this.state.stepData} changeStep={this.changeStep.bind(this)} />;
          break;
      }
      var objSubscription = this.state.subscription
      let subscriptionDetails = ''
      if (objSubscription.msg !== undefined && objSubscription.msg === 'SUBSCRIPTION_NOT_FOUND') {
        subscriptionDetails = (
          <div className='subscribe-details'><h3>Subscription not found!</h3></div>
        )
      } else if (objSubscription.status === 'cancelled') {
        subscriptionDetails = (
          <div className='subscribe-details'><h3>This subscription already unsubscribed!</h3></div>
        )
      } else {
        subscriptionDetails = content
      }
      return (
        <div className='subscribe-wrapper'>
          <div className='container'>{subscriptionDetails}</div>
        </div>
      )
    } else {
      return (
        <div className='subscribe-wrapper'>
          <div className='container'><h3>You have not logged in!</h3></div>
        </div>
      )
    }
  }

}

PageContent.propTypes = {}

export default PageContent
