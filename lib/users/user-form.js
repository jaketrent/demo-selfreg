import assign from 'lodash/object/assign'
import autobind from 'autobind-decorator'
import React from 'react'

import * as actions from './users-actions'

@autobind
class Field extends React.Component {
  static defaultProps = {
    type: 'text'
  }
  handleChange(evt) {
    this.props.onChange(evt.currentTarget.name, evt.currentTarget.value)
  }
  render() {
    return (
      <div>
        <label htmlFor={this.props.id}>
          {this.props.label}
          <input type={this.props.type} name={this.props.id} id={this.props.id} onChange={this.handleChange} />
        </label>
      </div>
    )
  }
}

@autobind
export default class RegistrationForm extends React.Component {
  handleSubmit(evt) {
    evt.preventDefault()
    actions.createUser(this.state)
  }
  handleFieldChange(name, value) {
    var newState = {}
    newState[name] = value
    this.setState(assign({}, this.state, newState))
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Field label="First Name" id="firstName" onChange={this.handleFieldChange} />
        <Field label="Last Name" id="lastName" onChange={this.handleFieldChange} />
        <Field label="Email" id="email" type="email" onChange={this.handleFieldChange} />
        <input type="submit" value="Register!" />
      </form>
    )
  }
}
