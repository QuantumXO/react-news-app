
import {getNewsList} from 'helpers/news';

import { SET_NEWS_LIST, GET_NEWS_ITEM, DELETE_NEWS_ITEM, EDIT_NEWS_ITEM, NEWS_LIST_FETCH_DATA_SUCCESS, NEWS_LIST_FETCH_DATA_FAILURE, NEWS_IS_LOADING } from 'constants/actionTypes'
import { convertDateFromUTC, trimString } from '../helpers/default'


export function setNewsList() {
  return dispatch => {

    const newsApiUrl = 'https://newsapi.org/v2/top-headlines?pageSize=5&sources=techcrunch&apiKey=a43db3869de64586a9421ee0fb8876e4';

    dispatch(newsIsLoading(true));

    return fetch(newsApiUrl)

      .then(res => {

        setTimeout(() => {
          dispatch(newsIsLoading(false));
        }, 1000);

        return res.json()
      })
      .then(data => {
        //console.log('data:', data)
        data.articles = data.articles.map((item, index) => {
          item.source.id = index
          item.contentFull = item.content
          item.content = trimString(item.content)
          item.publishedAt = convertDateFromUTC(item.publishedAt)
          return item
        });
        dispatch(newsListFetchDataSuccess(data.articles));
      })
      .catch(error => {

        dispatch(newsIsLoading(false));

        dispatch(newsListFetchDataFailure(error));
      });
  }
}

export function getNewsItem(data){
  return dispatch => {

    if(!data.appInited){
      dispatch(setNewsList())
        .then(() => {
          dispatch({
            type: GET_NEWS_ITEM,
            newsId: data.newsId,
          })

        });
    }else {
      dispatch({
        type: GET_NEWS_ITEM,
        newsId: data.newsId,
      })
    }
  }
}

export function deleteNewsItem(data){
  return {
    type: DELETE_NEWS_ITEM,
    data
  }
}

export function editNewsItem(data) {
  return {
    type: EDIT_NEWS_ITEM,
    data
  }
}

export function newsListFetchDataSuccess(newsList) {
  return {
    type: NEWS_LIST_FETCH_DATA_SUCCESS,
    newsList
  }
}

export function newsListFetchDataFailure(error) {
  return {
    type: NEWS_LIST_FETCH_DATA_FAILURE,
    error,
  }
}

export function newsIsLoading(loadingStatus) {
  return {
    type: NEWS_IS_LOADING,
    loadingStatus,
  }
}
