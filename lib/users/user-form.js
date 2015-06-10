import assign from 'lodash/object/assign'
import autobind from 'autobind-decorator'
import React from 'react'

import * as actions from './users-actions'
import userFormStore from './user-form-store'

@autobind
class Field extends React.Component {
  static propTypes = {
    /**
     * Identifies the react ref, html id and name
     */
    id: React.PropTypes.string.isRequired
  }
  static formatLabel(camelCase) {
    return camelCase.
      replace(/([A-Z])/g, ' $1').
      replace(/^./, firstLetter => firstLetter.toUpperCase())
  }
  static getInputType(fieldName) {
    var types = ['text', 'email', 'date', 'phone']
    var defaultIndex = 0
    var typeIndex = types.indexOf(fieldName)
    return types[typeIndex > -1 ? typeIndex : defaultIndex]
  }
  renderError() {
    if (this.props.error)
      return <div>Error: {this.props.error}</div>
  }
  render() {
    return (
      <div>
        <label htmlFor={this.props.id}>
          {this.renderError(this.props.id)}
          {Field.formatLabel(this.props.id)}
          <input type={Field.getInputType(this.props.id)}
                 name={this.props.id}
                 id={this.props.id}
                 ref={this.props.id}
                 defaultValue={this.props.value} />
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
    var getInputRef = (name) => {
      return this.refs[name].refs[name]
    }

    return {
      firstName: React.findDOMNode(getInputRef('firstName')).value,
      lastName: React.findDOMNode(getInputRef('lastName')).value,
      email: React.findDOMNode(getInputRef('email')).value
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
  renderField(fieldName, i) {
    return (
      <Field id={fieldName}
             ref={fieldName}
             key={i}
             value={this.state.user[fieldName]}
             error={this.state.errors[fieldName]} />
    )
  }
  renderFields(fields) {
    return fields.map(this.renderField)
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderFields(['firstName', 'lastName', 'email'])}
        <input type="submit" value="Register!" />
      </form>
    )
  }
}
