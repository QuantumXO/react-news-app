
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// React router
import { HashRouter, BrowserRouter, } from 'react-router-dom'

import ErrorBoundary from 'components/default/ErrorBoundary'
import AppContainer from 'containers/appContainer'

import configureStore from 'store/configureStore'
import Router from './router/router'
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <HashRouter>
        <AppContainer />
      </HashRouter>
    </ErrorBoundary>
  </Provider>,
  document.querySelector('#root'),
)

if (module.hot) {
  module.hot.accept()
}
