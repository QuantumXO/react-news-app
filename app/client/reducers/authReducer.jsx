
import { HANDLE_MODAL_AUTH_STATE, LOG_IN, LOG_OUT, SET_URL_TO_REDIRECT_FROM_MODAL, CHECK_AUTH_STATE } from 'constants/actionTypes'

import { checkAuth, authValidation } from 'helpers/auth'
import { setCookie, deleteCookie, redirectToUrl } from 'helpers/default'

const initialState = {
  user: null,
  modalAuthState: false,
  authErrors: null,
  urlToRedirect: null,
  authMethod: 'default',
}

export default function authReducer(state = initialState, action){
  switch (action.type) {

  case HANDLE_MODAL_AUTH_STATE:
    return handleModalState(state, action)

  case LOG_IN:
    return logIn(state, action)

  case LOG_OUT:
    return logOut(state, action)

  case SET_URL_TO_REDIRECT_FROM_MODAL:
    return {
      ...state,
      urlToRedirect: action.url
    }

  case CHECK_AUTH_STATE:
    return checkAuthState(state);

  default :
    return state
  }
}

function handleModalState(state, action) {
  const newState = {
    ...state,
    modalAuthState: (typeof action.modalState !== 'undefined') ? !action.modalState : !state.modalAuthState,
    urlToRedirect: null,
  }
  return newState
}

function logIn(state, action) {

  const authData = checkAuth();
  let newState = { ...state, authErrors: {}};

  if(!authData){
    // Log In

    const {authMethod, login, history} = action.data;

    const validationResult = authValidation(action.data);

    if(authMethod == 'auth2' || validationResult.status){

      newState.user = login;

      setCookie('user', {user: login, authMethod}, { 'max-age': 86400 }); // 1 day

      newState.modalAuthState = false;
      newState.authErrors = [];
      newState.authMethod = authMethod;

      if(state.urlToRedirect) newState.urlToRedirect = redirectToUrl(state.urlToRedirect, history);

    }else {
      newState.authErrors = validationResult.errors;
    }
  }

  return newState
}

function logOut(state, action) {

  const authData = state.user;

  let newState = { ...state };
  if(authData){
    // Log Out

    newState = {
      ...newState, // state
      user: null,
      modalAuthState: action.data.isPrivatePage ? true : false,
    };

    deleteCookie('user');
  }

  return newState
}

function checkAuthState(state) {

  const authState = checkAuth();

  if (authState){
    return {
      ...state,
      user: authState.user,
      authMethod: authState.authMethod,
    }
  }else {
    return state
  }
}
