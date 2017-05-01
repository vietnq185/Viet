/* eslint-disable */
import React from 'react'
import scrollToComponent from 'react-scroll-to-component'

import PageHeader from '../../Subscribe/components/PageHeader'
import PageContent from './PageContent'
import Footer from '../../../components/Footer'
import '../../../styles/subscribe.css'

class ForgotPassword extends React.Component {
  scrollTo() {
    scrollToComponent(this.refs.pageContent, { align: 'top' })
  }

  render() {
    return (
      <div style={{ margin: '0 auto' }} className='wrapper-bg-white'>
        <PageHeader scrollTo={() => this.scrollTo()} />
        <PageContent ref='pageContent' {...this.props} />
        <Footer />
      </div>
    )
  }
}

ForgotPassword.propTypes = {
}

export default ForgotPassword
