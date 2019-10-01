
import {
  LOG_IN,
  LOG_OUT,
  LOG_IN_SUCCESS,
  HANDLE_MODAL_AUTH_STATE,
  CHECK_AUTH_STATE } from 'constants/actionTypes'

import { checkAuth, authValidation } from 'helpers/auth'
import { setCookie, deleteCookie, } from 'helpers/default'

const initialState = {
  user: null,
  modalAuthState: false,
  authErrors: null,
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
  }
  return newState
}

function logIn(state, action) {

  const authData = checkAuth();
  const newState = { ...state, authErrors: {}};

  if(!authData){
    // Log In

    const {authMethod, login} = action.data;
    const validationResult = authValidation(action.data);

    if(authMethod == 'auth2' || validationResult.status){

      newState.user = login;

      setCookie('user', {user: login, authMethod}, { 'max-age': 86400 }); // 1 day

      newState.modalAuthState = false;
      newState.authErrors = [];
      newState.authMethod = authMethod;

      return {
        ...state,
        user: login,
        modalAuthState: false,
        authErrors: [],
        authMethod,
      }

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
