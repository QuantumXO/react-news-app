
import './_confirm.sass'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ConfirmModal extends Component{
  constructor(props){
    super(props);

    this.state = {
      open: false,
      callback: null,
    }
  }

  show = callback => event => {
    event.preventDefault()

    event = {
      ...event,
      target: { ...event.target, value: event.target.value }
    }

    this.setState({
      open: true,
      //callback: () => callback(event)
    })
  }

  hide = () => {
    this.setState(() => ({ open: false, callback: null}));
  }

  confirm = (e) => {
    e.preventDefault();
    this.props.handleConfirmFunc();
    this.hide()
  }

  render() {

    const {title, description, children} = this.props;

    return (
      <React.Fragment>
        {children(this.show)}

        {this.state.open && (
          <div className="confirm">
            <div className="confirm__inner">
              <h1 className="confirm__title">{title}</h1>
              <p className="confirm__desc">{description}</p>
              <div className="confirm__actions mt-1">
                <button className="btn btn--primary" onClick={this.confirm}>Confirm</button>
                <button className="btn btn--secondary ml-1" onClick={this.hide}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

ConfirmModal.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  authState: PropTypes.bool,
  handleConfirmFunc: PropTypes.func,
}
