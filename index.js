import assign from 'lodash-node/modern/object/assign'
import clone from 'lodash-node/modern/lang/clone'
import autobind from 'autobind-decorator'
import React from 'react'

@autobind
class App extends React.Component {
  constructor() {
    super()
    this.state = {}
  }
  handleRegistrationFormSubmit(user) {
    this.setState({
      user: user
    })
  }
  render() {
    return !!this.state.user ?
      <UserDisplay user={this.state.user} /> :
      <RegistrationForm onSubmit={this.handleRegistrationFormSubmit} />
  }
}

class UserDisplay extends React.Component {
  render() {
    return (
      <div>
        <h2>You&apos;re registered!</h2>
        <h1>{this.props.user.firstName} {this.props.user.lastName}</h1>
        <div>{this.props.user.email}</div>
      </div>
    )
  }
}

@autobind
class RegistrationForm extends React.Component {
  constructor() {
    super()
  }
  handleSubmit(evt) {
    evt.preventDefault()
    this.props.onSubmit(this.state)
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

@autobind
class Field extends React.Component {
  constructor() {
    super()
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
Field.defaultProps = {
  type: "text"
}

React.render(<App />, document.getElementById('app'))
