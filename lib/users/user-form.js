import assign from 'lodash/object/assign'
import autobind from 'autobind-decorator'
import React from 'react'

import * as actions from './users-actions'
import userFormStore from './user-form-store'

@autobind
class Field extends React.Component {
  static defaultProps = {
    type: 'text'
  }
  static propTypes = {
    /**
     * Identifies the react ref as well as the input name and id
     */
    ref: React.PropTypes.string.isRequired
  }
  handleChange(evt) {
    this.props.onChange(evt.currentTarget.name, evt.currentTarget.value)
  }
  render() {
    return (
      <div>
        <label htmlFor={this.props.ref}>
          {this.props.label}
          <input type={this.props.type} name={this.props.ref} id={this.props.ref} ref={this.props.ref} onChange={this.handleChange} />
        </label>
      </div>
    )
  }
}

@autobind
export default class UserForm extends React.Component {
  constructor() {
    super()
    this.state = this.getStateFromStores()
  }
  handleSubmit(evt) {
    evt.preventDefault()
    actions.createUser(this.parseUserForm())
  }
  parseUserForm() {
    function getInputRef() {
      
    }

    return {
      firstName: React.findDOMNode(this.refs.firstName).value
    }
  }
  componentDidMount() {
    userFormStore.listen(this.onStoresChange)
  }
  componentWillUnmount() {
    userFormStore.unlisten(this.onStoresChange)
  }
  onStoresChange() {
    this.setState(this.getStateFromStores)
  }
  getStateFromStores() {
    return {
      user: userFormStore.getUser(),
      errors: userFormStore.getErrors()
    }
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Field label="First Name" id="firstName" defaultValue={this.state.user.firstName}  />
        <Field label="Last Name" id="lastName" defaultValue={this.state.user.lastNAme}  />
        <Field label="Email" id="email" type="email" defaultValue={this.state.user.email}  />
        <input type="submit" value="Register!" />
      </form>
    )
  }
}
