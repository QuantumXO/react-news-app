

import { titleIsShortMsg, contentIsShortMsg } from './texts'
import { convertDateFromUTC, trimString } from './default'

export function newsValidation(data = {}) {
  let result = {status: true, errors: {}};

  if(data.title.length < 10){
    result.status = false;
    result.errors.title = titleIsShortMsg;
  }

  if(data.content.length < 15){
    result.status = false;
    result.errors.content = contentIsShortMsg;
  }

  return result
}

