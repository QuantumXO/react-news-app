
import { combineReducers } from 'redux'
import { connectRouter } from "connected-react-router"

import newsReducer from './newsReducer'
import authReducer from './authReducer'

export default (history) => combineReducers({
  authReducer,
  newsReducer,
  router: connectRouter(history),
})
