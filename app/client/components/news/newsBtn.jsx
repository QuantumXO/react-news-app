
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types';
import classnames from 'classnames'

export default class NewsBtn extends Component{

  constructor(props){
    super(props);
  }

  componentDidUpdate(prevProps, prevState, snapshot): void {

   const authState = this.props.authState

    if(authState !== prevProps.authState){
      this.setState(() => ({authState}))
    }
  }

  handleClick = (e) => {
    const {
      handleModalFunc,
      authState,
      isPrivate,
      actionFunc,
      actionParams,
      setRedirectUrlFunc,
      confirmFunc,
      type,
      history,
      url,
    } = this.props;

    if(isPrivate && handleModalFunc && !authState) {
      e.preventDefault();
      handleModalFunc();
      (typeof setRedirectUrlFunc == 'function') ? setRedirectUrlFunc(url) : null;

    }else {

      if(typeof confirmFunc == 'function'){
        confirmFunc(e);

      }else if(typeof actionFunc == 'function'){
        actionFunc(actionParams);

      }else if(url && history){
        history.push(url);
      }
    }
  }

  render(){

    const { classes, title, type, disabled = false} = this.props;

    const btnClass = classnames({
      'disabled': disabled,
    }, classes);

    if(type == 'submit'){
      return (
        <button
          type="submit"
          disabled={disabled}
          className={btnClass}
          onClick={this.handleClick}
        >{title}</button>
      )
    }else {
      return (
        <span
          className={btnClass}
          onClick={this.handleClick}
        >{title}</span>
      )
    }
  }
}

NewsBtn.propTypes = {
  actionFunc: PropTypes.func,
  handleModalFunc: PropTypes.func,
  confirmFunc: PropTypes.func,
  isPrivate: PropTypes.bool,
  disabled: PropTypes.bool,
  actionParams: PropTypes.object,
  history: PropTypes.object,
  setRedirectUrlFunc: PropTypes.func,
  type: PropTypes.string,
  url: PropTypes.string,
  title: PropTypes.string,
  classes: PropTypes.string,
}
