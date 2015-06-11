import assign from 'lodash/object/assign'
import clone from 'lodash/lang/clone'
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
  renderError(err, i) {
    return <li key={i}>{err}</li>
  }
  renderErrors(errs) {
    if (errs) {
      return (
        <ul>
          {errs.map(this.renderError)}
        </ul>
      )
    }
  }
  render() {
    return (
      <div>
        <label htmlFor={this.props.id}>
          {this.renderErrors(this.props.errors)}
          {Field.formatLabel(this.props.id)}
          <input type={Field.getInputType(this.props.id)}
                 name={this.props.id}
                 id={this.props.id}
                 ref={this.props.id}
                 onChange={this.props.onChange}
                 value={this.props.value} />
        </label>
      </div>
    )
  }
}

@autobind
export default class UserForm extends React.Component {
  static fields = ['firstName', 'lastName', 'email']
  constructor() {
    super()
    this.state = this.getStateFromStores()
  }
  handleSubmit(evt) {
    evt.preventDefault()
    actions.createUser(this.state.user)
  }
  componentDidMount() {
    userFormStore.listen(this.onStoresChange)
  }
  componentWillUnmount() {
    userFormStore.unlisten(this.onStoresChange)
  }
  onStoresChange() {
    this.setState(this.getStateFromStores, () => {
      let isEmptyForm = this.state.user === {}
      if (isEmptyForm)
        this.focusForm()
    })
  }
  focusForm() {
    let firstFieldName = this.constructor.fields[0]
    React.findDOMNode(this.refs[firstFieldName].refs[firstFieldName]).focus()
  }
  getStateFromStores() {
    return {
      user: userFormStore.getUser(),
      errors: userFormStore.getErrors()
    }
  }
  handleFieldChange(evt) {
    var user = clone(this.state.user)
    user[evt.target.name] = evt.target.value
    this.setState({
      user: user
    })
  }
  renderField(fieldName, i) {
    return (
      <Field id={fieldName}
             ref={fieldName}
             key={i}
             onChange={this.handleFieldChange}
             value={this.state.user[fieldName]}
             errors={this.state.errors.statusCode === 422 && this.state.errors.errors[fieldName]} />
    )
  }
  renderFields(fields) {
    return fields.map(this.renderField)
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderFields(this.constructor.fields)}
        <input type="submit" value="Register!" />
      </form>
    )
  }
}
