import React from 'react'
import ReactTooltip from 'react-tooltip'
import { fadeIn } from 'react-animations'
import { StyleSheet, css } from 'aphrodite'
import LocatingImage from '../../../styles/images/locating.svg'
import RouteImage from '../../../styles/images/route.svg'

import CompassImage from '../../../styles/images/compass.svg'
import SignsImage from '../../../styles/images/signs.svg'
import LocationImage from '../../../styles/images/location.svg'
import ScreendeviceImage from '../../../styles/images/screendevice.png'
import ScreenDevice2Image from '../../../styles/images/screen-device2.png'

const styles = StyleSheet.create({
  fadeIn: {
    animationName: fadeIn,
    animationDuration: '1s'
  }
})


class PageContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFreeTrialConfirmStudent: false,
      showFreeTrialConfirm: false
    }
  }

  changeTestimonial(index) {
    this.setupActiveTestimonial(index);
  }

  setupActiveTestimonial(index) {
    
  }

  componentDidMount() {
    this.setupActiveTestimonial(1)
  }

  render() {
    return (
      <div>
        <div className="page-section1 text-center">
          <h3 className="native dk-blue-text section1-text-header" id="scrollTo">How it Works ?</h3>
          <div className="container-fluid">

            <div className="row page-container">
              <div className="col-md-15 col-md-3 col-sm-3 col-sm-3-edit map-item1">
                <div className="row map-image">
                  <div className="col-md-3 col-xs-3 native">
                    <img className="image-map" src={LocatingImage} alt="Locating" />
                  </div>
                  <div className="col-md-9 col-xs-9 text-map dk-blue-text">
                    <div className="map-description">
                      Locating the
                          Learning Needs
                          <a className="map-learnmore dk-red-text" tabindex="0" data-tip="<span>SLS conducts ongoing analysis</span> of all Test and Practice Papers for all topics to <span>identify</span> the student's <span>learning needs.</span>" data-html="true">learn more <i className="fa fa-fw fa-angle-right"></i></a>
                      <ReactTooltip className="about-tooltip" place="bottom" type="light" html="true" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-15 col-md-3 col-sm-3 col-sm-3-edit map-item2">
                <div className="row map-image">
                  <div className="col-md-3 col-xs-3 native">
                    <img className="image-map" src={RouteImage} alt="Route" />
                  </div>
                  <div className="col-md-9 col-xs-9 text-map dk-blue-text">
                    <div className="map-description">
                      Planning the
                          Learning Route
                          <a className="map-learnmore dk-red-text" data-toggle="popover" data-trigger="focus" tabindex="0" data-placement="bottom" data-html="true" data-tip="<span>It generates a Personalised Learning Road Map</span> based on the identified learning needs.">learn more <i className="fa fa-fw fa-angle-right"></i></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-15 col-md-3 col-sm-3 col-sm-3-edit map-item3">
                <div className="row map-image">
                  <div className="col-md-3 col-xs-3 native">
                    <img className="image-map" src={CompassImage} alt="Map" />
                  </div>
                  <div className="col-md-9 col-xs-9 text-map dk-blue-text">
                    <div className="map-description">
                      Navigating the
                          Concept Map
                          <a className="map-learnmore dk-red-text" data-toggle="popover" data-trigger="focus" tabindex="0" data-placement="bottom" data-html="true" data-tip="Each worksheet is individualised based on performance from previous practice paper to <span>guide</span> the student in <span>navigating</span> the <span>Concept Map.</span>">learn more <i className="fa fa-fw fa-angle-right"></i></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-15 col-md-3 col-sm-3 col-sm-3-edit map-item4">
                <div className="row map-image">
                  <div className="col-md-3 col-xs-3 native">
                    <img className="image-map" src={SignsImage} alt="Destination" />
                  </div>
                  <div className="col-md-9 col-xs-9 text-map dk-blue-text">
                    <div className="map-description">
                      Arriving at Learning
                          Destination
                          <a className="map-learnmore dk-red-text" data-toggle="popover" data-trigger="focus" tabindex="0" data-placement="bottom" data-html="true" data-tip="Through targeted practice, the student <span>masters content</span> for all topics in the subject and <span>achieves</span> his/her <span>learning goals.</span>">learn more <i className="fa fa-fw fa-angle-right"></i></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-15 col-md-3 col-sm-3 col-sm-3-edit map-item5">
                <div className="row map-image">
                  <div className="col-md-3 col-xs-3 native">
                    <img className="image-map" src={LocationImage} alt="Location" />
                  </div>
                  <div className="col-md-9 col-xs-9 text-map dk-blue-text">
                    <div className="map-description">
                      Receiving
                          Comprehensive
                          Real-time Updates
                          <a className="map-learnmore dk-red-text" data-toggle="popover" data-trigger="focus" tabindex="0" data-placement="bottom" data-html="true" data-tip="Parents receive <span>comprehensive,  accurate</span> and <span>timely</span> updates of their child's progress on their mobile devices anytime, anywhere.">learn more <i className="fa fa-fw fa-angle-right"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="dk-blue-text section1-text-footer">
            Parent and child together on a happy
              and fulfilling learning journey
            </h3>
          <div className="section1-btn-group">
            <a href="programme">
              <button className="btn dk-btn dk-bg-blue dk-white">
                OUR PROGRAMME
                </button>
            </a>
          </div>
        </div>

        <div className="page-section2 text-center">
          <h3 className="dk-blue-text section2-text-header">
            Access anytime, anywhere, on the go and<br /> on your own schedule
            </h3>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <p className="description-highlight">
                Practice
                </p>
              <p className="description-screen-device">
                An online Web-Application available on <br /> Desktops and Tablets
                </p>
              <img className="image-device" src={ScreendeviceImage} alt="screenDevice" />
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <p className="description-highlight">
                Track Their Child's Learning
                </p>
              <p className="description-screen-device">
                An application available on Smartphones and Tablets
                </p>
              <img className="image-device image-device2" src={ScreenDevice2Image} alt="screendevice2" />
            </div>
          </div>
        </div>

        <div className="page-section3 text-center">
          <h3 className="dk-blue-text section2-text-header">
            What Others Say About Us
            </h3>
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-sm-12 col-xs-12 left-testimonial-container">
                <div className="section3-testimonial left-1 active">
                  <div className="section3-text-highlight dk-blue-text text-left">
                    <p>
                      I think it is very helpful
                      </p>
                  </div>
                  <div className="section3-text-comment text-left">
                    "My son is hard-working. He does lots of practice and corrections for Math and Science yet he doesn't improve much. I think this is because he does not know which concepts to focus. Here I think the A-SLS is very helpful because it identifies his weaknesses, and generates the individualised worksheets for him so he can focus on his weak areas to work and improve."
                    </div>
                  <div className="section3-text-writter text-right">
                    <h4 className="native dk-green-text">Susan, 40 years old</h4>
                    <p className="native">Parent with P5 son in 2016</p>
                  </div>
                </div>
                <div className="section3-testimonial left-2">
                  <div className="section3-text-highlight dk-blue-text text-left">
                    <p>
                      The Parent App provides this information to me so I can help him
                      </p>
                  </div>
                  <div className="section3-text-comment text-left">
                    "Being a parent, I want to and can only help my son if I monitor him closely especially know what are the areas he needs help. The Parent App provides this information to me so I can help him."
                    </div>
                  <div className="section3-text-writter text-right">
                    <h4 className="native dk-green-text">MeiLing, 45 years old</h4>
                    <p className="native">Parent with P6 son in 2016</p>
                  </div>
                </div>
                <div className="section3-testimonial left-3">
                  <div className="section3-text-highlight dk-blue-text text-left">
                    <p>
                      The A-SLS is a fantastic tool
                      </p>
                  </div>
                  <div className="section3-text-comment text-left">
                    "The A-SLS allows my daughter to study at home while I can monitor her progress on the Parent App even when I am not with her at home. The A-SLS is a fantastic tool, it helps both of us save a lot of cost, time and energy."
                    </div>
                  <div className="section3-text-writter text-right">
                    <h4 className="native dk-green-text">Karen, 42 years old</h4>
                    <p className="native">Parent with P5 daughter in 2016</p>
                  </div>
                </div>
                <div className="section3-testimonial left-4">
                  <div className="section3-text-highlight dk-blue-text text-left">
                    <p>
                      Best of all, I can monitor my child study anywhere and anytime.
                      </p>
                  </div>
                  <div className="section3-text-comment text-left">
                    "I find the Concept Map very useful as it helps me to know exactly the areas which my child needs to work on. Best of all, I can monitor my child study anywhere and anytime."
                    </div>
                  <div className="section3-text-writter text-right">
                    <h4 className="native dk-green-text">Josephine, 39 years old</h4>
                    <p className="native">Parent with P5 son in 2016</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-12 col-xs-12 right-testimonial-container">
                <div className="section3-testimonial right-1 active">
                  <div className="section3-text-highlight dk-blue-text text-left">
                    <p>
                      It is the best I have seen in the market
                      </p>
                  </div>
                  <div className="section3-text-comment text-left">
                    "I am impressed with the advanced technology of the A-SLS. Especially this system provides not only questions for practice, but also, most importantly, instant analysis for users. It is the best I have seen in the market."
                    </div>
                  <div className="section3-text-writter text-right">
                    <h4 className="native dk-green-text">David, 48 years old</h4>
                    <p className="native">Parent with P6 daughter in 2016</p>
                  </div>
                </div>
                <div className="section3-testimonial right-2">
                  <div className="section3-text-highlight dk-blue-text text-left">
                    <p>
                      This A-SLS allows me to study from home
                      </p>
                  </div>
                  <div className="section3-text-comment text-left">
                    "I don't like to rush to the tuition centre for classes after school. This A-SLS allows me to study from home and I can also receive immediate feedback from doing the worksheets."
                    </div>
                  <div className="section3-text-writter text-right">
                    <h4 className="native dk-green-text">Chloe, 12 years old</h4>
                    <p className="native">Student who is P6 in 2016</p>
                  </div>
                </div>
                <div className="section3-testimonial right-3">
                  <div className="section3-text-highlight dk-blue-text text-left">
                    <p>
                      I am more focused on my studies
                      </p>
                  </div>
                  <div className="section3-text-comment text-left">
                    "I like to do questions on computer. It is more fun. I am more focused on my studies while doing the worksheets on the computer than on paper."
                    </div>
                  <div className="section3-text-writter text-right">
                    <h4 className="native dk-green-text">Michael, 11 years old</h4>
                    <p className="native">Student who is P5 in 2016</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section3-paging">
            <input type="radio" name="testimonial-paging" id="first" onchange="changeTestimonial(1)" checked />
            <input type="radio" name="testimonial-paging" id="second" onchange="changeTestimonial(2)" />
            <input type="radio" name="testimonial-paging" id="third" onchange="changeTestimonial(3)" />
            <input type="radio" name="testimonial-paging" id="forth" onchange="changeTestimonial(4)" />
            <label className="section3-paging-item dk-bg-gray" for="first"><span></span></label>
            <label className="section3-paging-item dk-bg-gray" for="second"><span></span></label>
            <label className="section3-paging-item dk-bg-gray" for="third"><span></span></label>
            <label className="section3-paging-item dk-bg-gray" for="forth"><span></span></label>
          </div>
          <div>
            <h3 className="dk-blue1 tree-trial">
              Join our learning group today!
              </h3>
            <button className="btn dk-btn dk-bg-blue dk-white" data-toggle='modal' data-target='#modalFreeTrialConfirm' onClick={() => this.setState({ showFreeTrialConfirm: true })}>
              START A FREE TRIAL
              </button>
          </div>
        </div>

        {/* <!-- Modal --> */}
        <div id='modalFreeTrialConfirm' aria-hidden='false' className={['modal fade', this.state.showFreeTrialConfirm ? 'in' : '', css(styles.fadeIn)].join(' ')} role='dialog' style={this.state.showFreeTrialConfirm ? { display: 'block' } : { display: 'none' }}>
          <div className='modal-dialog'>
            {/* <!-- Modal content--> */}
            <div className='modal-content'>
              <div className='modal-header text-center'>
                <span className='modalFreeTrialConfirmTitle'>Free Trial</span>
                <button type='button' className='close' data-dismiss='modal' onClick={() => this.setState({ showFreeTrialConfirm: false })}>&times;</button>
              </div>
              <div className='modal-body'>
                <p className='text-center'>Are you a student or parent?</p><br />
                <div className='text-center'>
                  <a className='btn dk-bg-green dk-white mb5' data-dismiss='modal' data-toggle='modal' data-target='#modalFreeTrialConfirmStudent' onClick={() => this.setState({ showFreeTrialConfirm: false, showFreeTrialConfirmStudent: true })}>I AM A STUDENT</a>
                  <a className='btn dk-bg-blue dk-white mb5' href='/subscribe'>I AM A PARENT</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='modalFreeTrialConfirmStudent' aria-hidden='false' className={['modal fade', this.state.showFreeTrialConfirmStudent ? 'in' : '', css(styles.fadeIn)].join(' ')} role='dialog' style={this.state.showFreeTrialConfirmStudent ? { display: 'block' } : { display: 'none' }}>
          <div className='modal-dialog'>
            {/* <!-- Modal content--> */}
            <div className='modal-content'>
              <div className='modal-header text-center'>
                <span className='modalFreeTrialConfirmTitle'>Free Trial</span>
                <button type='button' className='close' data-dismiss='modal' onClick={() => this.setState({ showFreeTrialConfirmStudent: false })}>&times;</button>
              </div>
              <div className='modal-body'>
                <p className='text-center'>Thank you for your interest! Please let your parents to create an account and signup ASLS for you!</p><br />
                <div className='text-center'>
                  <a className='btn dk-bg-green dk-white' href='javascript: void(0);' onClick={() => this.onCreateParent()}>PARENT? SIGNUP FOR A-SLS</a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

PageContent.propTypes = {}

export default PageContent
