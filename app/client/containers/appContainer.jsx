
import 'assets/styles.sass'

import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authAction from 'actions/authAction'
import Router from '../router/router'
import Footer from 'components/default/footer/footer'

class AppContainer extends Component{

  constructor(props){
    super(props)

    this.props.authAction.checkAuthState();
  }

  componentDidMount(): void {}

  render(){
    return (
      <Fragment>
        <Router />
        <Footer />
      </Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  authAction: bindActionCreators(authAction, dispatch),
})

export default connect(null, mapDispatchToProps)(AppContainer)
