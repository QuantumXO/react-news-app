
import { trimString, redirectToUrl } from 'helpers/default'
import { newsValidation } from 'helpers/news'
import { NEWS_IS_LOADING, GET_NEWS_ITEM, DELETE_NEWS_ITEM, EDIT_NEWS_ITEM, NEWS_LIST_FETCH_DATA_SUCCESS, NEWS_LIST_FETCH_DATA_FAILURE } from 'constants/actionTypes'

const initialState = {
  newsList: [],
  newsItem: null,
  appInited: false,
  newsListIsEmpty: false,
  loadingStatus: false,
  newsErrors: null,
  newsItemError: null,
}

export default function newsReducer(state = initialState, action){

  switch (action.type) {

  case NEWS_IS_LOADING:
    return newsIsLoading(state, action);

  case NEWS_LIST_FETCH_DATA_SUCCESS:
    return setNewsList(state, action);

  case GET_NEWS_ITEM:
    return getNewsItem(state, action);

  case DELETE_NEWS_ITEM:
    return deleteNewsItem(state, action);

  case EDIT_NEWS_ITEM:
    return editNewsItem(state, action);

  case NEWS_LIST_FETCH_DATA_FAILURE:
    return newsListFetchDataFailure(state, action);

  default :
    return state
  }
}

function newsIsLoading(state, action) {
  return {
    ...state,
    loadingStatus: action.loadingStatus
  }
}

function setNewsList(state, action) {
  return {
    ...state,
    newsList: action.newsList,
    appInited: true,
    newsListIsEmpty: !action.newsList.length ? true : false,
  }
}

function getNewsItem(state, action) {

  const newsItem = state.newsList.filter(item => item.source.id == action.newsId)[0];

  const newState = {
    ...state,
    newsItem: newsItem ? newsItem : null,
    newsItemError: newsItem ? false : true,
  }
  return newState
}

function deleteNewsItem(state, action) {

  const {newsId, urlToRedirect, history} = action.data;

  const newsItem = (state.newsItem && state.newsItem.source.id == newsId) ? null : state.newsItem;
  const newsList = state.newsList.filter(item => item.source.id != newsId);

  const newState = {
    ...state,
    newsList,
    newsItem: newsItem,
    newsListIsEmpty: !newsList.length ? true : false,
  }

  if(urlToRedirect) newState.urlToRedirect = redirectToUrl(urlToRedirect, history);

  return newState
}

function editNewsItem(state, action) {

  const {newsId, title, content, author} = action.data;

  const validationResult = newsValidation({title, content});

  let newState;

  if(validationResult.status){

    const newsList = state.newsList.map(item => {
      return (item.source.id == newsId) ? {...item, title, contentFull: content, content: trimString(content), author} : item
    });

    newState = {
      ...state,
      newsItem: newsList.filter(item => item.source.id == newsId)[0],
      newsList: newsList,
      newsErrors: null,
    }

  }else {
    newState = {
      ...state,
      newsErrors: validationResult.errors,
    }
  }

  return newState
}

function newsListFetchDataFailure(state, action) {

  return {
    ...state,
    newsErrors: action.error
  }

}
