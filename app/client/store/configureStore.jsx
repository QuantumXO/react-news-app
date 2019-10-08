
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from "connected-react-router"
import history from 'helpers/history';

import { loadLocalStorageState, saveLocalStorageState } from 'helpers/localStorageState'
import rootReducer from 'reducers/rootReducer'

export default function configureStore(initialState) {

  const persistedState = loadLocalStorageState();
  const middleWares = [thunk, routerMiddleware(history)]

  if(process.env.NODE_ENV != 'production'){
    const logger = createLogger()
    middleWares.push(logger)
  }

  const store = createStore(
    rootReducer(history),
    persistedState,
    composeWithDevTools(applyMiddleware(...middleWares)),
  )

  if(!loadLocalStorageState()){
    //saveLocalStorageState(store.getState())
  }

  store.subscribe(() => {
    //saveLocalStorageState(store.getState())
  })

  return store
}

