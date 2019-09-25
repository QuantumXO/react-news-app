import {
  HANDLE_MODAL_AUTH_STATE,
  LOG_IN,
  LOG_OUT,
  SET_URL_TO_REDIRECT_FROM_MODAL,
  CHECK_AUTH_STATE
} from 'constants/actionTypes'

export function handleAuthModalState(modalState) {
  return {
    type: HANDLE_MODAL_AUTH_STATE,
    modalState,
  }
}

export function checkAuthState() {
  return {
    type: CHECK_AUTH_STATE,
  }
}

export function GoogleLogIn(data) {
  return dispatch => {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    return GoogleAuth.signIn({ scope: "profile email" })
      .then(
        user => {
          dispatch(logIn({login: user.getBasicProfile().getName(), password: '123', authMethod: 'auth2'}))
        },
        err => console.log('Error: ', err)
      )
  }
}

export function logIn(data = {}) {
  return {
    type: LOG_IN,
    data,
  }
}

export function logOut(data) {
  return {
    type: LOG_OUT,
    data,
  }
}

export function GoogleLogOut(data) {
  return dispatch => {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    return GoogleAuth.signOut()
      .then(
        () => {
          dispatch(logOut({}))
        },
        err => console.log('Error: ', err)
      )
  }
}

export function setUrlToRedirectFromModal(url) {
  return {
    type: SET_URL_TO_REDIRECT_FROM_MODAL,
    url,
  }
}
