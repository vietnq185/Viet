import React from 'react'
import { IndexLink, Link } from 'react-router'
import './PageHeader.scss'

class PageHeader extends React.Component {
  render() {
    return (
      <div className='subscribe-header'>
        <nav className='navbar navbar-default dk-navbar' role='navigation'>
          {/* Brand and toggle get grouped for better mobile display */}
          <div className='navbar-header'>
            {/* button for mobile display. show menu */}
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='.navbar-ex1-collapse' aria-expanded='false'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar' />
              <span className='icon-bar' />
              <span className='icon-bar' />
            </button>
            <IndexLink to='/' className='subscribe-navbar-brand'>A-SLS</IndexLink>
          </div>
          {/* Top Menu Items */}
          <div className='collapse navbar-collapse navbar-ex1-collapse navbar-right'>
            <ul className='nav navbar-nav side-nav'>
              {/*<li><IndexLink to='/' className='side-nav-item route--link' activeClassName='route--link--active dk-yellow'>Home</IndexLink></li>*/}
              <li><Link to='programme' className='side-nav-item route--link' activeClassName='route--link--active dk-yellow'>Our Programme</Link></li>
              <li><Link to='student' className='side-nav-item route--link' activeClassName='route--link--active dk-yellow'>For Student</Link></li>
              <li><Link to='parent' className='side-nav-item route--link' activeClassName='route--link--active dk-yellow'>For Parent</Link></li>
              <li><Link to='subscribe' className='side-nav-item route--link' activeClassName='route--link--active dk-yellow'>Free Trial</Link></li>
              {/* <li><a href="contact"> <span class="side-nav-item">Contact</span></a></li> */}
              {/* <li><a href='javascript: void(0);' data-toggle='modal' data-target='#loginModal'> <span className='side-nav-item'>Sign Up</span></a></li> */}
              <li className='signin'><a href='https://app.a-smartlearning.com/en/sml/login' className='text-signin'> <span className='side-nav-item'>Sign In</span></a></li>
            </ul>
          </div>
          {/* /.navbar-collapse */}
        </nav>
      </div>
    )
  }
}

PageHeader.propTypes = {
  scrollTo: React.PropTypes.func.isRequired
}

export default PageHeader
