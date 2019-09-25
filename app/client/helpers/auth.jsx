
import {getCookie} from './default'
import {loginIsShortMsg, passwordIsShortMsg} from './texts'

export function checkAuth() {

  const dataFromCookie = getCookie('user');

  if(!dataFromCookie) return false;
  else return dataFromCookie;
}

export function logIn(data) {

  const authState = checkAuth();

  if(!authState){
    return authValidation(data);

  }else return true;
}

export function authValidation(data = {}) {
  let result = {status: true, errors: {}};

  if(data.login.length < 3){
    result.status = false;
    result.errors.login = loginIsShortMsg;
  }

  if(data.password.length < 3){
    result.status = false;
    result.errors.password = passwordIsShortMsg;
  }

  return result
}

export function GoogleAPIInit() {
  return window.gapi.load('auth2', function () {
    window.gapi.auth2
      .init({
        client_id: '889151844072-ngbvq8nkf3ebea4alct6jso8pcai9euj.apps.googleusercontent.com'
      })
  })
}
