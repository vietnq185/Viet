import React from 'react'
import scrollToComponent from 'react-scroll-to-component'

import PageHeader from './PageHeader'
import PageContent from './PageContent'
import Footer from '../../../components/Footer'
import '../../../styles/programme.css'

class Programme extends React.Component {
  scrollTo () {
    scrollToComponent(this.refs.pageContent, { align: 'top' })
  }

  render () {
    return (
      <div style={{ margin: '0 auto' }} >
        <PageHeader scrollTo={() => this.scrollTo()} />
        <PageContent ref='pageContent' />
        <Footer showPromotionBanner={true} />
      </div>
    )
  }
}

Programme.propTypes = {}

export default Programme
