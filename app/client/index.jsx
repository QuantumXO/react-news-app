
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import history from 'helpers/history';
// React router
import { HashRouter, BrowserRouter, Router} from 'react-router-dom'

import ErrorBoundary from 'components/shared/ErrorBoundary'
import AppContainer from 'containers/appContainer'

import configureStore from 'store/configureStore'
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <Router history={history}>
        <AppContainer />
      </Router>
    </ErrorBoundary>
  </Provider>,
  document.querySelector('#root'),
)

if (module.hot) {
  module.hot.accept()
}
