/* eslint-disable */

import React from 'react'
import Header from '../../../components/Header'
import ScrollImage from '../../../styles/images/mouse-scroll.png'

class PageHeader extends React.Component {
  render () {
    return (
      <div className='student-header dk-white'>
        <Header />
        <div className='content-wraper text-center'>
          <h1 className='student-title'>Your Smart Learning Journey</h1>
          <hr className='dk-gb-white programme-hr' />
          <div>
            <h3 className='student-sub-title'>A-SLS knows what you need and will plan a Learning Package which is specially for you.</h3>
          </div>
          <p className='student-next-text fw9'>LEARN HOW YOUR JOURNEY COULD BE</p>
          <a href='javascript: void(0);' onClick={() => this.props.scrollTo()}><img className='mouse-scroll' src={ScrollImage} /></a>
        </div>
      </div >
    )
  }
}
PageHeader.propTypes = {
  scrollTo: React.PropTypes.func.isRequired
}

export default PageHeader
