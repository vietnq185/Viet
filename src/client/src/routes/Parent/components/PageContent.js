import React from 'react'

import Utils from '../../../helpers/utils'

import ParentItem1Image from '../../../styles/images/parent-item1.png'
import ParentItem2Image from '../../../styles/images/parent-item2.png'
import ParentItem3Image from '../../../styles/images/parent-item3.png'
import ParentItem4Image from '../../../styles/images/parent-item4.png'
import ParentItem5Image from '../../../styles/images/parent-item5.png'

class PageContent extends React.Component {

  onCreateParent () {
    this.props.changeStep(this.props.subscribe.steps.signUp) // eslint-disable-line
    Utils.redirect('/subscribe')
  }
  render () {
    return (
      <div>
        <div className='parent-section1 text-center'>
          <h3 className='dk-blue-text parent-section1-text-header'>Parent Mobile Application</h3>
          <div className='text-left'>
            <div className='container-fluid' style={{ maxWidth: '650px' }}>
              <div className='row parent-section1-item'>
                <div className='col-md-4 col-xs-12 text-center'>
                  <img className='pull-right parent-item-icon' src={ParentItem1Image} alt='Mobile-app' />
                </div>
                <div className='col-md-8 col-xs-12 text-left'>
                  <div className='parent-section1-item2'>
                    <p className='parent-section1-sub1'>Mobile App for Parents</p>
                    <p className='parent-section1-sub2'>Parents can <span className='dk-blue' style={{ cursor: 'pointer' }} data-toggle='modal' data-target='#parentModal'>download</span> the mobile app on both iOS and Android devices <span className='dk-blue'>for free</span> and add your child's account to receive instant report of your child's learning progress</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <!--./item--> */}
            <div className='container-fluid' style={{ maxWidth: '650px' }}>
              <div className='row parent-section1-item'>
                <div className='col-md-8 col-xs-12 text-right'>
                  <div className='parent-section1-item2'>
                    <p className='parent-section1-sub1'>Live View on Device</p>
                    <p className='parent-section1-sub2'>Parents can choose to "Follow" your child's performance and view your child's status and activities online.</p>
                  </div>
                </div>
                <div className='col-md-4 col-xs-12 text-center'>
                  <img className='parent-item-icon pull-left' src={ParentItem2Image} alt='Mobile-app' />
                </div>
              </div>
            </div>
            {/* <!--./item--> */}
            <div className='container-fluid' style={{ maxWidth: '650px' }}>
              <div className='row parent-section1-item'>
                <div className='col-md-4 col-xs-12 text-center'>
                  <img className='pull-right parent-item-icon' src={ParentItem4Image} alt='Mobile-app' />
                </div>
                <div className='col-md-8 col-xs-12 text-left'>
                  <div className='parent-section1-item2'>
                    <p className='parent-section1-sub1'>Timely Report of Performance</p>
                    <p className='parent-section1-sub2'>Parents can closely monitor your child's performance by receiving instant "Daily/Weely/Monthly" report of results and analysis.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <!--./item--> */}
            <div className='container-fluid' style={{ maxWidth: '650px' }}>
              <div className='row parent-section1-item'>
                <div className='col-md-8 col-xs-12 text-right'>
                  <div className='parent-section1-item2'>
                    <p className='parent-section1-sub1'>Study with Your Child</p>
                    <p className='parent-section1-sub2'>Understanding your child's areas for improvement by viewing his/her "Mistakes made".
                      Empathising with your child by trying the questions that your child did wrongly and showing him/her the correct answers</p>
                  </div>
                </div>
                <div className='col-md-4 col-xs-12 text-center'>
                  <img className='parent-item-icon pull-left' src={ParentItem3Image} alt='Mobile-app' />
                </div>
              </div>
            </div>
            {/* <!--./item--> */}
            <div className='container-fluid' style={{ maxWidth: '650px' }}>
              <div className='row parent-section1-item'>
                <div className='col-md-4 col-xs-12 text-center'>
                  <img className='pull-right parent-item-icon' src={ParentItem5Image} alt='Mobile-app' />
                </div>
                <div className='col-md-8 col-xs-12 text-left'>
                  <div className='parent-section1-item2'>
                    <p className='parent-section1-sub1'>Bonding with Your Child</p>
                    <p className='parent-section1-sub2'>By closely monitoring your child and understanding the challenges he/she encounters, you will be able to bond with your child and share the joy of his/her learning journey.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!--/.planet-group--> */}
          <div className='parent-section1-footer'>
            <p className='parent-section1-footer-text dk-blue-text'>Be There for Your Child on His/Her Learning Journey</p>
            <div>
              <button className='btn dk-btn dk-bg-blue dk-white' data-toggle='modal' data-target='#parentModal' onClick={() => this.onCreateParent()}>
                CREATE PARENT ACCOUNT
              </button>
              {/* <button className="btn dk-btn dk-bg-green dk-white">
                TELL YOUR FRIENDS
              </button> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PageContent.propTypes = {}

export default PageContent
