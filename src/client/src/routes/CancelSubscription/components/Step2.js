/* eslint-disable */
import React from 'react'

class Step2 extends React.Component {

  constructor(props) {
    super(props)
    const { objSubscription } = this.props
  }
  
  render() {
    const { objSubscription } = this.props
		console.log('step 2 => step data: ', this.props.stepData)
    return (
      <div className="subscribe-cancellation">
				<h2>We are sorry to see you go. <span className="face-sad"><i className="fa fa-smile-o"></i></span></h2>
				<form action='' method=''>
					<div className="form-group">
						Please enter your password to confirm your subscription cancellation!
					</div>
					<div className="form-group">
						<input className="form-control" name="password" id="password" required="" type="password" />
					</div>
					<div className="form-group">
						(If you are cancelling your subscription by mistake, please turn back to <a href="">your subscription</a> and remedy it)
					</div>
					<p>&nbsp;</p>
					<div className="form-group text-center">
						<button type="button" className="btn dk-bg-green dk-white">Cancel Subscription</button>
					</div>
					<p>&nbsp;</p>
				</form>
			</div>
    )
  }
}

Step2.propTypes = {
}

export default Step2
