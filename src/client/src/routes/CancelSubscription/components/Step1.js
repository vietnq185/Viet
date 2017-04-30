/* eslint-disable */
import React from 'react'

class Step1 extends React.Component {

	constructor(props) {
		super(props)
		const { objSubscription } = this.props
		this.state = {
			showErrorMsg: false,
			isValid: false
		}
	}

	submitForm() {
		const step1 = {}
		for (var key in this.refs) {
			if (this.refs.hasOwnProperty(key)) {
				step1[key] = this.refs[key]
				if ((this.refs[key].type === 'checkbox' && this.refs[key].checked === true) || (this.refs[key].type === 'textarea' && this.refs[key].value !== '')) {
					this.state.isValid = true
				}
			}
		}

		if (this.state.isValid) {
			this.props.changeStep(2, { step1 })
		} else {
			this.setState({ showErrorMsg: true })
		}
	}

	render() {
		const { objSubscription } = this.props
		return (
			<div className="subscribe-cancellation">
				<h2>We are sorry to see you go. <span className="face-sad"><i className="fa fa-smile-o"></i></span></h2>
				<p>Your are cancelling your subscription.</p>
				<p>We would be very grateful if you could let you know the reason why you wish to unsubscribe, so that we can improve our service in feature.</p>
				<p>Thank you.</p>
				<p>(If you are cancelling your subscription by mistake, please turn back to <a href={['/subscription-details/', objSubscription._id].join('')}>your subscription</a> and remedy it)
				</p>
				<form action='' method='post'>
					<div className="checkbox">
						<label><input type="checkbox" name="chk1" ref="chk1" />My child lacks of time to do it.</label>
					</div>
					<div className="checkbox">
						<label><input type="checkbox" name="chk2" ref="chk2" />A-SLS is too expensive.</label>
					</div>
					<div className="checkbox">
						<label><input type="checkbox" name="chk3" ref="chk3" />It is not user-friendly.</label>
					</div>
					<div className="checkbox">
						<label><input type="checkbox" name="chk4" ref="chk4" />The quality of content is not good.</label>
					</div>
					<div className="checkbox">
						<label><input type="checkbox" name="chk5" ref="chk5" />It does not help my child to improve.</label>
					</div>
					<div className="checkbox">
						<label><input type="checkbox" name="chk6" ref="chk6" />It is not interesting to engage my child.</label>
					</div>
					<div className="checkbox">
						<label><input type="checkbox" name="chk7" ref="chk7" />Your emails are too frequent or irrelevant.</label>
					</div>
					<div className="checkbox">
						<label><input type="checkbox" name="chk8" ref="chk8" />I have signed up another e-learning application for my child.</label>
					</div>
					<div className="checkbox">
						<label><input type="checkbox" name="chk9" ref="chk9" />My child has finished primary education.</label>
					</div>
					<div className="checkbox">
						<label>Other reason(s), please write in the box:</label>
					</div>
					<div className="form-group">
						<textarea ref="other_reasons" name="other_reasons" className="form-control" rows="5" placeholder="Please state:"></textarea>
					</div>
					<div className="form-group text-center">
						<button type="button" className="btn dk-bg-green dk-white" onClick={() => this.submitForm()}>Submit</button>
					</div>
					<div className="alert alert-danger" style={this.state.showErrorMsg ? { display: 'block' } : { display: 'none' }}>Please let us know the reason why you wish to unsubscribe. Thank you.</div>
				</form>
			</div>
		)
	}
}

Step1.propTypes = {
}

export default Step1
