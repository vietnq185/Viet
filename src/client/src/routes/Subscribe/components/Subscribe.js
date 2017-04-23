/* eslint-disable */

import React from 'react'
import scrollToComponent from 'react-scroll-to-component'

import PageHeader from './PageHeader'
import PageContent from './PageContent'
import Footer from '../../../components/Footer'

import '../../../styles/subscribe.css'

class Subscribe extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: this.props.step
    }
  }

  scrollTo () {
    scrollToComponent(this.refs.pageContent, { align: 'top' })
  }

  componentWillReceiveProps (nextProps) {
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.step !== prevProps.step) {
      this.scrollTo()
    }
  }

  render () {
    const { auth } = this.props // eslint-disable-line
    let contentPage = contentPage = (<PageContent ref='pageContent' {...this.props} />)
    if (!auth || (auth.isLoggedIn && (!auth.jwt || !auth.jwt.isParent))) {
      contentPage = (
        <div ref='pageContent' className='subscribe-wrapper' style={{ height: '700px', color: 'red', paddingTop: '100px' }}>Permission Deny.</div>
      )
    }
    return (
      <div className='wrapper' style={{ margin: '0 auto', height: '100%' }} >
        <PageHeader scrollTo={() => this.scrollTo()} />
        {contentPage}
        <Footer />
      </div>
    )
  }
}

Subscribe.propTypes = {
  step: React.PropTypes.string.isRequired
}

export default Subscribe
