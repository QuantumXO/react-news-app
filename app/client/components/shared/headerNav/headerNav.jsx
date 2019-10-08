
import './_headerNav.sass'

import React, { Component, Fragment } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import NewsBtn from 'components/news/NewsBtn'
import { bindActionCreators } from 'redux'
import * as authAction from 'actions/authAction'

class HeaderNav extends Component{

  constructor(props){
    super(props);

    this.state = {
      user: this.props.authProps.user || '',
    }
  }

  componentDidMount(){
    const {isPrivatePage, authProps, authAction} = this.props;

    if(!authProps.user && isPrivatePage) {
      authAction.handleAuthModalState(false);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){

    const {isPrivatePage, authProps, authAction} = this.props;

    const user = authProps.user;

    if(user !== prevProps.authProps.user){
      this.setState(() => ({user}),
        () => {
          if(isPrivatePage && !user){
            authAction.handleAuthModalState(false); // show
          }else if(user){
            authAction.handleAuthModalState(true);  // hide
          }
        }
      )
    }
  }

  handleClick = () => {

    const { isPrivatePage = false, authAction, authProps} = this.props;

    if(authProps.user){
      authAction.logOut();

      if(isPrivatePage){
        authAction.handleAuthModalState(false)
      }

    }else{
      authAction.handleAuthModalState(false)
    }
  }

  render(){

    const {authProps, authAction, isPrivatePage} = this.props;

    const btnClass = classNames('btn header__auth__btn', {
      'btn--primary': !authProps.user,
      'btn--secondary': authProps.user,
    })

    return (
      <div className='header__nav'>
        <div className="container">
          <div className="row">
            <Link
              to=''
              className='header__link'
            >Home</Link>
            <div className="header__auth__inner">
              {authProps.user ? (
                <Fragment>
                  <span className="header__auth__name">{authProps.user}</span>
                  <span className="ml-05 mr-05"> | </span>
                </Fragment>
              ) : null}

              <NewsBtn
                isPrivate={true}
                classes={btnClass}
                authState={authProps.user && true}
                title={authProps.user ? 'Log Out' : 'Log In'}
                actionParams={{
                  isPrivatePage: isPrivatePage && true,
                }}
                actionFunc={!authProps.user ? authAction.handleAuthModalState : authProps.authMethod == 'auth2' ? authAction.GoogleLogOut : authAction.logOut}
                handleModalFunc={authAction.handleAuthModalState}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  authProps: state.authReducer,
})

const mapDispatchToProps = dispatch => ({
  authAction: bindActionCreators(authAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNav)
