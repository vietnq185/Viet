import React from 'react'
import scrollToComponent from 'react-scroll-to-component'

import RocketImage from '../../../styles/images/rocket.png'
import Planet1Image from '../../../styles/images/planet1.png'
import Planet2Image from '../../../styles/images/planet2.png'
import Planet3Image from '../../../styles/images/planet3.png'
import Planet4Image from '../../../styles/images/planet4.png'
import Planet5Image from '../../../styles/images/planet5.png'
import Planet6Image from '../../../styles/images/planet6.png'
import Planet7Image from '../../../styles/images/planet7.png'

class PageContent extends React.Component {

  render() {
    return (
      <div>
        <div className='student-section1 text-center'>
          <p className='student-section1-text dk-blue-text'>We do not believe <span className='student-section1-text fw'>"The More, The Better"</span>.</p>
          <p className='student-section1-discription'>What a student needs is the <span className='fw9'>right</span> worksheets to practice on, but <span className='fw9'>more</span> worksheets.</p>
          {/* <p class="student-section1-discription">
              A-SLS knows what you need and will plan a Learning Package that is <span class="fw9">only for you</span>.
            </p> */}
          {/* <p class="student-section1-discription">
              Be ready to start this uniquely, extraordinarily exciting experience with KaKa-Smart.
            </p>
            <p class="student-section1-discription">
              This is KaKa-Smart, your loving and loyal companion, on your Smart Learning Journey.
            </p> */}
          <div className='student-section1-footer'>
            <p className='student-section1-footer-text dk-blue-text'>Study with Us to Achieve Your Best Potential</p>
          </div>
          <button className='btn dk-btn dk-bg-blue dk-white' onClick={() => scrollToComponent(this.refs.journey, { align: 'top' })}>See how your smart learning journey look like</button>
          {/* <!-- /.container-fluid --> */}
        </div>
        {/* <!--/.page-section1--> */}
        {/* <!-- page-section2--> */}
        <div className='student-section2 text-center' ref='journey'>
          <h3 className='dk-blue-text student-section2-text-header'>Your Smart Learning Journey</h3>
          <img className='rocket' src={RocketImage} alt='Rocket' />
          <div className='text-left'>
            <div className='planet1'>
              <div className='planet'>
                <img src={Planet1Image} alt='planet1' />
              </div>
              <div className='planet-text text-left'>
                <div className='map-description'>
                  <p className='planet-text-sub1 native fw9'>ENJOY</p>
                  <p className='planet-text-sub2 native dk-blue-text'>Fun Features to Support<br /> Question Taking</p>
                  <a className='map-learnmore dk-red-text' data-toggle='popover' data-trigger='focus' tabIndex='0' data-placement='bottom' data-html='true'
                    data-content='<span>"Hint"</span>, <span>"50/50"</span> and <span>"What others choose the most"</span> are some interesting features to assist you when you take the questions. You can also post a question to ask the teacher if you find it really challenging and have no clue of the answer.'>learn more <i className='fa fa-fw fa-angle-right' /></a>
                </div>
              </div>
            </div>
            {/* <!--/.plane--> */}
            <div className='planet2'>
              <div className='planet'>
                <img src={Planet2Image} alt='planet2' />
              </div>
              <div className='planet-text text-left'>
                <div className='map-description'>
                  <p className='planet-text-sub1 native fw9'>REVISE IN</p>
                  <p className='planet-text-sub2 native dk-blue-text'>Mistakes Bank</p>
                  <a className='map-learnmore dk-red-text' data-toggle='popover' data-trigger='focus' tabIndex='0' data-placement='bottom' data-html='true'
                    data-content='The questions that you answered wrongly will be collected in this <span>"Mistakes Bank"</span> as a reference for your revision.'>learn more <i className='fa fa-fw fa-angle-right' /></a>
                </div>
              </div>
            </div>
            {/* <!--/.plane--> */}
            <div className='planet3'>
              <div className='planet'>
                <img src={Planet3Image} alt='planet3' />
              </div>
              <div className='planet-text text-left'>
                <div className='map-description'>
                  <p className='planet-text-sub1 native fw9'>VIEW YOUR</p>
                  <p className='planet-text-sub2 native dk-blue-text'>Results and Analysis Report</p>
                  <a className='map-learnmore dk-red-text' data-toggle='popover' data-trigger='focus' tabIndex='0' data-placement='bottom' data-html='true'
                    data-content='Individual scores and the percentage of correct answers for every question are reported and shown in all worksheets.'>learn more <i className='fa fa-fw fa-angle-right' /></a>
                </div>
              </div>
            </div>
            {/* <!--/.plane--> */}
            <div className='planet4'>
              <div className='planet'>
                <img src={Planet4Image} alt='planet4' />
              </div>
              <div className='planet-text text-left'>
                <div className='map-description'>
                  <p className='planet-text-sub1 native fw9'>RECEIVE</p>
                  <p className='planet-text-sub2 native dk-blue-text'>Instant Marking and Feedback</p>
                  <a className='map-learnmore dk-red-text' data-toggle='popover' data-trigger='focus' tabIndex='0' data-placement='bottom' data-html='true'
                    data-content="You will receive instant marking and feedback for MCQ questions and teacher's marking on structured questions. The result of each worksheet is analyzed and factored in the next worksheet generated by the system.">learn more <i className='fa fa-fw fa-angle-right' /></a>
                </div>
              </div>
            </div>
            {/* <!--/.plane--> */}
            <div className='planet5'>
              <div className='planet'>
                <img src={Planet5Image} alt='planet5' />
              </div>
              <div className='planet-text text-left'>
                <div className='map-description'>
                  <p className='planet-text-sub1 native fw9'>STAY ON</p>
                  <p className='planet-text-sub2 native dk-blue-text'>High Quality Practice</p>
                  <a className='map-learnmore dk-red-text' data-toggle='popover' data-trigger='focus' tabIndex='0' data-placement='bottom' data-html='true'
                    data-content='We provide thousands of high quality practice questions for all topics in the latest school syllabus (2017) and Mock/Prelim Exams that are arranged in various difficulty levels, and assign to you based on your academic ability and readiness.'>learn more <i className='fa fa-fw fa-angle-right' /></a>
                </div>
              </div>
            </div>
            {/* <!--/.plane--> */}
            <div className='planet6'>
              <div className='planet'>
                <img src={Planet6Image} alt='planet6' />
              </div>
              <div className='planet-text text-left'>
                <div className='map-description'>
                  <p className='planet-text-sub1 native fw9'>ASSIGNED AN</p>
                  <p className='planet-text-sub2 native dk-blue-text'>Individualised Learning Plan</p>
                  <a className='map-learnmore dk-red-text' data-toggle='popover' data-trigger='focus' tabIndex='0' data-placement='bottom' data-html='true'
                    data-content='A-SLS plans a Personalised Learning Road Map of Test and Practice Papers that is targeted to help you build on your strengths and address your areas for improvement.'>learn more <i className='fa fa-fw fa-angle-right' /></a>
                </div>
              </div>
            </div>
            {/* <!--/.plane--> */}
            <div className='planet7'>
              <div className='planet'>
                <img src={Planet7Image} alt='planet7' />
              </div>
              <div className='planet-text text-left'>
                <div className='map-description'>
                  <p className='planet-text-sub1 native fw9'>START WITH</p>
                  <p className='planet-text-sub2 native dk-blue-text'>Smart, Dynamic and Continuous Diagnosis</p>
                  <a className='map-learnmore dk-red-text' data-toggle='popover' data-trigger='focus' tabIndex='0' data-placement='bottom' data-html='true'
                    data-content='A-SLS identifies your academic strengths and areas for improvement through dynamic diagnosis on each worksheet you complete.'>learn more <i className='fa fa-fw fa-angle-right' /></a>
                </div>
              </div>
            </div>
          </div>
          {/* <!--/.planet-group--> */}
          <div className='student-section2-footer-container'>
            <p className='student-section2-footer dk-blue-text'>Enjoy this fun-filled, effective and efficient<br /> learning journey</p>
            <div>
              <a href='https://app.a-smartlearning.com/en/sml/login?mode=register'>
                <button className='btn dk-btn dk-bg-blue dk-white'>CREATE STUDENT ACCOUNT</button>
              </a>
              {/* <button class="btn dk-btn dk-bg-green dk-white">
                TELL YOUR FRIENDS
              </button> */}
            </div>
          </div>
        </div>
        {/* <!--/.page-section2--> */}
      </div>
    )
  }

}

PageContent.propTypes = {}

export default PageContent
