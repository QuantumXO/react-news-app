
import 'assets/styles.sass'

import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authAction from 'actions/authAction'
import Routes from '../router/router'
import Footer from 'components/shared/footer/footer'

class AppContainer extends Component{

  constructor(props){
    super(props)

    this.props.authAction.checkAuthState();
  }

  componentDidMount(): void {}

  render(){
    return (
      <Fragment>
        <Routes />
        <Footer />
      </Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  authAction: bindActionCreators(authAction, dispatch),
})

export default connect(null, mapDispatchToProps)(AppContainer)
