import React from 'react'
import scrollToComponent from 'react-scroll-to-component'

import PageHeader from '../../Subscribe/components/PageHeader'
import Footer from '../../../components/Footer'

import '../../../styles/subscribe.css'

class NotFound extends React.Component {
  scrollTo () {
    scrollToComponent(this.refs.pageContent, { align: 'top' })
  }

  render () {
    return (
      <div className='wrapper' style={{ margin: '0 auto', height: '100%' }} >
        <PageHeader scrollTo={() => this.scrollTo()} />
        <div className='subscribe-wrapper'>
          <div ref='pageContent' style={{ height: '700px', color: 'white', paddingTop: '100px' }}>Not found</div>
        </div>
        <Footer />
      </div>
    )
  }
}

NotFound.propTypes = {
}

export default NotFound
