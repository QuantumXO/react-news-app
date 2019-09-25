
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ConfirmModal from 'components/default/confirmModal/confirmModal'

export default class WithConfirm extends Component{
  constructor(props){
    super(props);

    this.state = {
      open: false,
      ...props
    }
  }

  open = () => {this.setState(() => ({open: true}))}

  onConfirm = (e) => {
    const {actionFunc, actionParams = null} = this.props;

    if(typeof actionFunc == 'function'){
      actionFunc(actionParams);
    }
  }

  render(): React.ReactNode {

    const {title, description, redirectUrl, authState} = this.props;

    const Component = this.state.Component;

    return (
      <ConfirmModal
        title={title || null}
        handleConfirmFunc={this.onConfirm}
        description={description || null}
        redirectUrl={redirectUrl || null}
      >
        {confirm => (
          <Component confirmFunc={confirm()} authState={authState} />
        )}
      </ConfirmModal>
    )
  }

}

WithConfirm.propTypes = {
  authState: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  description: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  Component: PropTypes.any,
  actionParams: PropTypes.object,
  actionFunc: PropTypes.func,
  redirectUrl: PropTypes.string,
}
