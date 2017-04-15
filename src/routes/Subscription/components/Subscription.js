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

  render () {
    return (
      <div className='wrapper-bg-white' style={{ margin: '0 auto', height: '100%' }} >
        <PageHeader scrollTo={() => this.scrollTo()} />
        <PageContent ref='pageContent' scrollTo={() => this.scrollTo()} {...this.props} />
        <Footer />
      </div>
    )
  }
}

Subscription.propTypes = {
}

export default Subscription
