/* eslint-disable */
import React from 'react'
import API from '../../../helpers/api'
import Utils from '../../../helpers/utils'
import validate from '../../../helpers/validate'
import * as authActions from '../../../store/auth'

class Step2 extends React.Component {

	constructor(props) {
		super(props)
		this.initialErrors = {
			password: ''
		}
		this.errors = Utils.copy(this.initialErrors)
		this.state = {
			hasError: false,
			errMsg: ''
		}
	}

	resetErrors() {
		this.errors = Utils.copy(this.initialErrors)
		this.setState({ hasError: false })
	}

	setErrors(errors) {
		this.errors = errors
		this.setState({ hasError: true })
	}
	submitForm() {
		const self = this

		this.resetErrors()

		const rules = {
			password: {
				required: 'Please enter your password.'
			}
		}

		const result = validate(rules, this.refs)  // result === null -> valid, result === error object -> invalid
		if (result === null) {
			const cancellationData = {}
			const step1Data = self.props.stepData.step1
			for (var key in step1Data) {
				if (step1Data.hasOwnProperty(key)) {
					if (step1Data[key].type === 'checkbox') {
						console.log(step1Data[key].name)
						if (step1Data[key].checked === true) {
							cancellationData[step1Data[key].name] = 1
						} else {
							cancellationData[step1Data[key].name] = 0
						}
					}
				}
			}
			cancellationData.other_reasons = step1Data.other_reasons.value
			const { objSubscription } = this.props
			return authActions.checkAccessToken().then((jwt) => {
				const dataUpdate = {
					subscriptionId: objSubscription._id,
					stripeSubscriptionId: objSubscription.stripeSubscriptionId,
					subscriptionChannel: objSubscription.channel,
					password: self.refs.password.value,
					cancellationData
				}
				return API.cancelSubscription(jwt.accessToken || '', dataUpdate).then((result) => {
					if (result.status === 'ERR') {
						switch (result.msg) {
							case 'UNREGISTERED_USER':
								this.setState({ errMsg: 'Email not found.' })
								break
							case 'WRONG_PASSWORD':
								this.setState({ errMsg: 'Incorrect password.' })
								break
							default:
								this.setState({ errMsg })
						}
					} else {
						this.props.changeStep(3)
					}
				}).catch((errMsg) => {
					switch (errMsg) {
						case 'UNREGISTERED_USER':
							this.setState({ errMsg: 'Email not found.' })
							break
						case 'WRONG_PASSWORD':
							this.setState({ errMsg: 'Incorrect password.' })
							break
						default:
							this.setState({ errMsg })
					}
				})
			}).catch((error) => {
				console.info('changeSubscriptionStatus => checkAccessToken => error: ', error)
			})
		} else {
			this.setErrors(result)
		}
	}

	render() {
		const { objSubscription } = this.props
		const requiredLabel = (<abbr className='dk-red-text'>&nbsp;*</abbr>)
		console.log('step 2 => step data: ', this.props.stepData)
		return (
			<div className="subscribe-cancellation">
				<h2>We are sorry to see you go. <span className="face-sad"><i className="fa fa-smile-o"></i></span></h2>
				<form action='' method=''>
					<div className="form-group">
						Please enter your password to confirm your subscription cancellation! {requiredLabel}
					</div>
					<div className={['form-group', this.errors.password ? 'has-error' : ''].join(' ')}>
						<input className='form-control' name='password' id='password' required='' type='password' ref='password' />
						<span className={[this.errors.password ? 'help-block' : 'hide'].join(' ')}>{this.errors.password}</span>
					</div>
					<div className={['form-group', this.state.errMsg ? 'has-error' : 'hide'].join(' ')}>
						<span className='help-block'>{this.state.errMsg}</span>
					</div>
					<div className="form-group">
						(If you are cancelling your subscription by mistake, please turn back to <a href="">your subscription</a> and remedy it)
					</div>
					<p>&nbsp;</p>
					<div className="form-group text-center">
						<button type="button" className="btn dk-bg-green dk-white" onClick={() => this.submitForm()}>Cancel Subscription</button>
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
