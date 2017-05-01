import React from 'react'
import scrollToComponent from 'react-scroll-to-component'

import PageHeader from '../../Subscribe/components/PageHeader'
import Footer from '../../../components/Footer'
import PageNotFoundImage from '../../../styles/images/404.png'
import '../../../styles/subscribe.css'

class NotFound extends React.Component {
  scrollTo () {
    scrollToComponent(this.refs.pageContent, { align: 'top' })
  }

  render () {
    return (
      <div className='wrapper'>
        <PageHeader scrollTo={() => this.scrollTo()} />
        <div className='subscribe-wrapper'>
          <div ref='pageContent'>
            <div className='pageNotFoundImage'><img src={PageNotFoundImage} alt='Page Not Found' /></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

NotFound.propTypes = {
}

export default NotFound
