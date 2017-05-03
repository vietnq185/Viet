import { connect } from 'react-redux'

import Footer from './Footer'

const mapStateToProps = (state) => ({
  ...state.subscribe,
  auth: state.auth
})

export default connect(mapStateToProps)(Footer)
