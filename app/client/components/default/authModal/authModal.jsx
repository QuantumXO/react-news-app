
import './_authModal.sass'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import history from 'helpers/history';
import {withRouter} from 'react-router-dom'
import { GoogleAPIInit } from 'helpers/auth'
import { CSSTransition } from 'react-transition-group'
import * as authAction from 'actions/authAction'

import Input from 'components/default/form/input'

class AuthModal extends Component{

  constructor(props){
    super(props)

    const {authProps} = this.props;

    this.state = {
      login: '',
      password: '',
      formNotEmpty: false,
      errors: authProps.authErrors || {},
      open: authProps.modalAuthState,
    }

    this.logIn = this.logIn.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleFieldValue = this.handleFieldValue.bind(this)
    this.handleModalState = this.handleModalState.bind(this)
    this.closeModalOnClickOutside = this.closeModalOnClickOutside.bind(this)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    const {user, authErrors, modalAuthState} = this.props.authProps;

    if(user !== prevProps.authProps.user){
      this.setState(() => ({login : '', password: '', formNotEmpty: false, errors: {}, open: false}))


    }else if(authErrors !== prevProps.authProps.authErrors){
      this.setState(() => ({errors : authErrors,}));

    }else if(modalAuthState !== prevProps.authProps.modalAuthState){
      this.setState(() => ({open : this.props.authProps.modalAuthState,}));
    }
  }

  componentDidMount(): void {
    GoogleAPIInit();
    document.addEventListener('click', this.closeModalOnClickOutside);
    document.addEventListener('keydown', this.closeModalOnClickOutside, false);

    this.setState({errors: {}});
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.closeModalOnClickOutside)
    document.removeEventListener('keydown', this.closeModalOnClickOutside, false)
  }

  handleFieldValue(e){

    const target = e.target;

    const {errors} = this.state;

    const newsErrors = errors;
    delete newsErrors[target.name];

    this.setState(() => ({
      [target.id]: target.value,
      errors: newsErrors,
    }), () => {

      const {login, password} = this.state;

      this.setState(() => ({
        formNotEmpty: (login.length != 0 && password.length != 0) ? true : false,
      }))
    })
  }

  logIn(e){
    e.preventDefault();

    const {login, password} = this.state;
    const {authAction} = this.props;

    authAction.logIn({login, password})
  }

  googleLogIn = () => {
    this.props.authAction.GoogleLogIn();
  }

  handleModalState(){
    this.closeModal();
  }

  closeModalOnClickOutside(e){
    if(this.props.authProps.modalAuthState){
      const target = e.target;

      if(target.classList.contains('modal') || e.keyCode === 27){ // Esc - 27
        this.closeModal();
      }
    }
  }

  closeModal(){
    this.props.authAction.handleAuthModalState(true);

    if(this.props.isPrivatePage){
      history.push('/');
    }
  }

  render(): React.ReactNode {

    if(!this.props.authProps.modalAuthState) return null

    const {login, password, errors} = this.state;

    return (
      <div className="modal" onClick={this.closeModalOnClickOutside}>

        <CSSTransition
          classNames="alert"
          timeout={500}
          in={this.state.open}
        >
        <div className="modal__inner">
          <h4 className="modal__title">Authorisation</h4>
          <span className="modal__close" onClick={this.handleModalState}>x</span>
          <form className="modal__form">

            <Input
              type="text"
              name="login"
              label="Name (any > 3 letter)"
              placeholder="Enter login"
              value={login}
              error={errors.login}
              handleChangeFunc={this.handleFieldValue}
            />

            <Input
              type="password"
              name="password"
              label="Password (any > 3 letter)"
              placeholder="Enter password"
              value={password}
              error={errors.password}
              handleChangeFunc={this.handleFieldValue}
            />

            <div className="modal__form__group __actions">
              <button type="submit"
                className="btn btn--big btn--primary"
                onClick={this.logIn}
                disabled={!this.state.formNotEmpty}
              >Log In</button>
              <span className="btn btn--big btn--dark ml-1" onClick={this.handleModalState}>Cancel</span>
            </div>

            <div className="modal__form__group __social">
              <p className="modal__form__union small">or</p>
              <span className="modal__form__social" onClick={this.googleLogIn}>Continue with google</span>
            </div>

          </form>
        </div>
        </CSSTransition>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthModal))

AuthModal.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  authAction: PropTypes.object,
  authProps: PropTypes.shape({
    user: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    modalAuthState: PropTypes.bool,
    authErrors: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    authMethod: PropTypes.string,
  }),
}
