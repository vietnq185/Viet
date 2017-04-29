import React from 'react';
import { Grid, Button, Modal, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';  // eslint-disable-line

import API from '../../helpers/api'
import Utils from '../../helpers/utils'
import validate from '../../helpers/validate'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.initialErrors = {
      email: '',
      password: ''
    }
    this.errors = Utils.copy(this.initialErrors)
    this.state = {
      showModal: true,
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

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  login = () => {
    const self = this

    this.resetErrors()

    const rules = {
      email: {
        required: 'Email is required',
        email: 'Invalid email address'
      },
      password: {
        required: 'Password is required'
      }
    }

    const result = validate(rules, this.refs)  // result === null -> valid, result === error object -> invalid

    if (result === null) {
      // can submit
      API.login({ username: self.refs.email.value, password: self.refs.password.value }).then((result) => {
        self.props.loginSuccess(result)
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
      //
    } else {
      this.setErrors(result)
    }
  }

  render() {
    return (
      <Grid>
        {/*{this.renderOnPage()}*/}
        {this.renderDialog()}
      </Grid>
    );
  }

  renderLoginForm() {
    console.info('Login component => props: ', this.props);

    const requiredLabel = (<abbr className='dk-red-text'>&nbsp;*</abbr>)
    return (
      <form className='form'>
        <div className={['form-group', this.errors.email ? 'has-error' : ''].join(' ')}>
          <label htmlFor='contact-name'>Email address{requiredLabel}</label>
          <input className='form-control' name='email' id='email' required='' type='text' ref='email' />
          <span className={[this.errors.email ? 'help-block' : 'hide'].join(' ')}>{this.errors.email}</span>
        </div>
        <div className={['form-group', this.errors.password ? 'has-error' : ''].join(' ')}>
          <label htmlFor='contact-name'>Password{requiredLabel}</label>
          <input className='form-control' name='password' id='password' required='' type='password' ref='password' />
          {/*<span className='forgot-password'><a href='javascript: void(0);'>Forgot password?</a></span>*/}
          <span className={[this.errors.password ? 'help-block' : 'hide'].join(' ')}>{this.errors.password}</span>
        </div>
        <div className={['form-group', this.state.errMsg ? 'has-error' : 'hide'].join(' ')}>
          <span className='help-block'>{this.state.errMsg}</span>
        </div>
        <div className='form-group'>
          <Button bsStyle="success" onClick={() => this.login()}>Log in</Button>
        </div>
      </form>
    );
  }

  renderOnPage() {
    return this.renderLoginForm();
  }

  renderDialog() {
    return (
      <Modal show={this.state.showModal} autoFocus={true} keyboard={false}>
        <Modal.Header closeButton={false}>
          <Modal.Title>LOGIN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderLoginForm()}
        </Modal.Body>
        {/*<Modal.Footer>
          <Button onClick={() => this.close()}>Close</Button>
        </Modal.Footer>*/}
      </Modal>
    );
  }
};
