
import React, { Component } from 'react'
import PropTypes from 'prop-types';

import ConfirmModal from 'components/shared/confirmModal/confirmModal'

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
    const {actionFunc} = this.props;

    if(typeof actionFunc == 'function'){
      actionFunc();
    }
  }

  render(): React.ReactNode {

    const {title, description, authState} = this.props;

    const Component = this.state.Component;

    return (
      <ConfirmModal
        title={title || null}
        handleConfirmFunc={this.onConfirm}
        description={description || null}
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
}
