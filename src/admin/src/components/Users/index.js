// From here we can use react-redux to connect them together
// OR just simply export the component

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import * as actions from '../../reducers/user'
import * as authActions from '../../reducers/auth'

import Component from './component';

const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = {
  ...actions,
  ...authActions,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
