import assign from 'lodash/object/assign'
import omit from 'lodash/object/omit'
import axios from 'axios'
import clone from 'lodash/lang/clone'
import autobind from 'autobind-decorator'
import React from 'react'
import keyMirror from 'react/lib/keyMirror'
import EventEmitter from 'events'
import { Dispatcher } from 'flux'

var appDispatcher = new Dispatcher()

var constants = keyMirror({
  CREATE_USER: null,
  CREATE_USER_SUCCESS: null
})

var actions = {
  createUser(user) {
    apiHelpers.createUser(user)
    appDispatcher.dispatch({
      actionType: constants.CREATE_USER,
      user
    })
  },
  createUserSuccess(user) {
    appDispatcher.dispatch({
      actionType: constants.CREATE_USER_SUCCESS,
      user
    })
  }
}

var apiHelpers = {
  async createUser(user) {
    function serialize(rawUser) {
      return {
        data: assign({}, rawUser, {
          type: 'users'
        })
      }
    }

    function deserialize(apiUser) {
      return omit(apiUser.data, 'type', 'links')
    }

    var res = await axios({
      method: 'post',
      url: 'http://demo-users-api.herokuapp.com/api/v1/users',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      data: serialize(user)
    })
    actions.createUserSuccess(deserialize(res.data))
  }
}

var registrationStore = assign({}, EventEmitter.prototype, {
  listen(listener) {
    this.addListener('change', listener)
  },
  unlisten(listener) {
    this.removeListener('change', listener)
  },
  hasRegistration() {
    return !!this._user
  },
  setRegistration(user) {
    this._user = user
    this.emitChange()
  },
  getRegistration() {
    return clone(this._user)
  },
  emitChange() {
    this.emit('change', arguments)
  }
})
registrationStore.dispatchToken = appDispatcher.register(function (payload) {
  switch(payload.actionType) {
    case constants.CREATE_USER_SUCCESS:
      this._user = payload.user
      this.emitChange()
      break
  }
}.bind(registrationStore))


@autobind
class App extends React.Component {
  constructor() {
    super()
    this.state = this.getStateFromStores()
  }
  componentWillMount() {
    registrationStore.listen(this.onStoreChange)
  }
  componentWillUnmount() {
    registrationStore.unlisten(this.onStoreChange)
  }
  onStoreChange() {
    this.setState(this.getStateFromStores())
  }
  getStateFromStores() {
    return {
      user: registrationStore.getRegistration(),
      hasRegistration: registrationStore.hasRegistration()
    }
  }
  render() {
    return this.state.hasRegistration ?
      <UserDisplay user={this.state.user} /> :
      <RegistrationForm />
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

React.render(<App />, document.getElementById('app'))
