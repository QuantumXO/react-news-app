
import React from 'react'
import { Switch, Route } from 'react-router-dom'

// Containers
import NewsContainer from 'containers/news/newsContainer'
import NewsDetailsContainer from 'containers/newsDetails/newsDetailsContainer'
import NewsEditContainer from 'containers/newsEdit/newsEditContainer'
import NotFoundContainer from 'containers/notFound/notFoundContainer'

const Routes = () => {
  return(
      <Switch>
        <Route exact path='/' component={NewsContainer} />
        <Route exact path='/:id' component={NewsDetailsContainer} />
        <Route path='/:id/edit' component={NewsEditContainer} />
        <Route path='**' component={NotFoundContainer} />
      </Switch>
  )
}

export default Routes
