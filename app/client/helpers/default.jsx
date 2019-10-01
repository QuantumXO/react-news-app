
// возвращает куки с указанным name,
// или undefined, если ничего не найдено
export function getCookie(name) {
  const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'))
  return matches ? JSON.parse(decodeURIComponent(matches[1])) : undefined
}

export function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    expires: 0,
    ...options,
  }

  if (options.expires.toUTCString) {
    options.expires = options.expires.toUTCString()
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(JSON.stringify(value))

  for (let optionKey in options) {
    updatedCookie += '; ' + optionKey
    const optionValue = options[optionKey]
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue
    }
  }

  document.cookie = updatedCookie
}

export function deleteCookie(name) {
  setCookie(name, '', {
    'max-age': -1,
  })
}

export function trimString(str = '', count = 200){

  if (str.length >= count) {
    str = str.substr(0, count)
    str += '...'
  }
  // console.log('[default.ts] -> trimString __ str: ', str);

  return str
}

export function convertDateFromUTC(date = null) {

  let newDate = new Date(date);

  let day = newDate.getDate()
  let month = newDate.getMonth()

  if (day < 10) day = `0${day}`;
  if (month < 10) month = `0${month}`;

  newDate = `${month}/${day}/${newDate.getFullYear()}`;

  return newDate
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

export function replaceWhitespaceWithUnderscore(str = '') {
  return str.replace(/[\s/]/g, '_')
}

export function reload() {
  location.reload();
}
