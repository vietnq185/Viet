import React from 'react'
import Header from '../../../components/Header'
import ScrollImage from '../../../styles/images/mouse-scroll.png'
import AppleImage from '../../../styles/images/apple.png'
import GoogleImage from '../../../styles/images/google.png'

class PageHeader extends React.Component {
  render () {
    return (
      <div className='parent-header dk-white'>
        <Header />

        <div className='content-wraper text-center'>
          <h1 className='parent-title'>Study with Your Child</h1>
          <div>
            <p className='parent-sub-title fw9'>A Smart Application on iOS and Android that helps you to</p>
            <p className='parent-sub-title'><span className='dk-yellow'>Understand</span> your child's academic strengths and areas for improvement</p>
            <p className='parent-sub-title'><span className='dk-yellow'>Receive</span> instant updates and reports</p>
            <p className='parent-sub-title'><span className='dk-yellow'>Study with your child</span> to understand the challenges he/she faces</p>
            <p className='parent-sub-title'><span className='dk-yellow'>Get</span> help and advice from teachers</p>
          </div>
          <div className='mt2'>
            <a href='https://itunes.apple.com/us/app/a-sls/id1128693154?ls=1&mt=8'>
              <div className='store'>
                <div className='store-item'>
                  <img src={AppleImage} alt='Apple Store' />
                </div>
                <div className='store-item store-item-text'>
                  <p className='dk-white'>Apple Store</p>
                </div>
              </div>
            </a>
            <a href='https://play.google.com/store/apps/details?id=com.inspicorp.sls_android'>
              <div className='store ml1'>
                <div className='store-item'>
                  <img src={GoogleImage} alt='Google Store' />
                </div>
                <div className='store-item store-item-text'>
                  <p className='dk-white'>Google Store</p>
                </div>
              </div>
            </a>
          </div>
          <p className='parent-next-text fw9'>LEARN MORE ABOUT THE FEATURES</p>
          <a href='javascript: void(0);' onClick={() => this.props.scrollTo()}><img className='mouse-scroll' src={ScrollImage} /></a>
        </div>

      </div>
    )
  }
}

PageHeader.propTypes = {
  scrollTo: React.PropTypes.func.isRequired
}

export default PageHeader
