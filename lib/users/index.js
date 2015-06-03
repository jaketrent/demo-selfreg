import autobind from 'autobind-decorator'
import React from 'react'

import UserDisplay from './user-display'
import RegistrationForm from './user-form'
import registrationStore from './users-store'

@autobind
export default class App extends React.Component {
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
