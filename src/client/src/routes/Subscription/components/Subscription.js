import React from 'react'
import scrollToComponent from 'react-scroll-to-component'

import PageHeader from '../../Subscribe/components/PageHeader'
import PageContent from './PageContent'
import Footer from '../../../components/Footer'

import '../../../styles/subscribe.css'

class Subscription extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  scrollTo () {
    scrollToComponent(this.refs.pageContent, { align: 'top' })
  }

  componentWillReceiveProps (nextProps) {
  }

  componentDidUpdate (prevProps, prevState) {
  }

  componentDidMount() {
    // reset subscript to default
    this.props.restart();
  }

  render () {
    const { auth } = this.props // eslint-disable-line
    let contentPage = (<PageContent ref='pageContent' scrollTo={() => this.scrollTo()} {...this.props} />)
    if (!auth || (auth.isLoggedIn && (!auth.jwt || !auth.jwt.isParent))) {
      contentPage = (
        <div ref='pageContent' className='subscribe-wrapper' style={{ height: '700px', color: 'red', paddingTop: '100px' }}>Permission Deny.</div>
      )
    }
    return (
      <div className='wrapper-bg-white' style={{ margin: '0 auto', height: '100%' }} >
        <PageHeader scrollTo={() => this.scrollTo()} />
        {contentPage}
        <Footer />
      </div>
    )
  }
}

Subscription.propTypes = {
}

export default Subscription
