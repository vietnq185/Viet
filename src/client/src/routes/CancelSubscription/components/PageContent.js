/* eslint-disable */
import React from 'react'
import Utils from '../../../helpers/utils'
import API from '../../../helpers/api'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

class PageContent extends React.Component {
  constructor (props) {
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

  componentDidMount () {
    var self = this
    API.getSubscriptionDetails(this.state.id).then((subscription) => this.setState({ subscription })).catch((error) => {
      self.setState({ subscription: Utils.copy(self.initialSubscription) })
    })
  }

  render () {
    const {step} = this.state;
    let content = Step1;
    console.log('step data: ', this.state)
    switch(step){
      case 1:
      content = <Step1 stepData={this.state.stepData} changeStep={this.changeStep.bind(this)} />;
      break;
      case 2:
      content = <Step2 stepData={this.state.stepData} changeStep={this.changeStep.bind(this)} />;
      break;
      case 3:
      content = <Step3 stepData={this.state.stepData} changeStep={this.changeStep.bind(this)} />;
      break;
    }
    var objSubscription = this.state.subscription
    let subscriptionDetails = ''
    if (objSubscription.msg !== undefined && objSubscription.msg === 'SUBSCRIPTION_NOT_FOUND') {
      subscriptionDetails = (
        <div className='subscribe-details'><h3>Subscription not found!</h3></div>
      )
    } else {
      subscriptionDetails = content
    }
    return (
      <div className='subscribe-wrapper'>
        <div className='container'>{subscriptionDetails}</div>
      </div>
    )
  }

}

PageContent.propTypes = {}

export default PageContent
