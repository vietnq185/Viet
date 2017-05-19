/* eslint-disable */
import React from 'react'
import Utils from '../../../helpers/utils'

class Step3 extends React.Component {

	constructor(props) {
		super(props)
		const { objSubscription } = this.props
	}

	render() {
		const { objSubscription } = this.props
		if (objSubscription.channel == 'bank') {
			return (
				<div className="subscribe-cancellation">
					<p>&nbsp;</p>
					<p>This is not saying goodbye, you are always served by us.</p>
					<p>To cancel your subscription, please contact us via: +65 4321 1234.</p>
					<p>If you are unsubscribing by mistake, and wish to re-subscribe, please turn back to <a href="javascript:void(0);" onClick={() => Utils.redirect('/subscription')}>your subscription</a> and continue to enjoy our amazing learning system.</p>
				</div>
			)
		} else {
			return (
				<div className="subscribe-cancellation">
					<p>&nbsp;</p>
					<p>This is not saying goodbye, you are always served by us.</p>
					<p>You have already unsubscribed, you will not be charged any more.</p>
					<p>However, if you change your mind, you can always subscribe again by <a href="javascript:void(0);" onClick={() => Utils.redirect('/subscribe')}>selecting plan</a> and continue to enjoy our learning system.</p>
				</div>
			)
		}
	}
}

Step3.propTypes = {
}

export default Step3
