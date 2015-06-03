import autobind from 'autobind-decorator'
import React from 'react'

import UserDisplay from './user-display'
import UserForm from './user-form'
import userStore from './users-store'

@autobind
export default class App extends React.Component {
  constructor() {
    super()
    this.state = this.getStateFromStores()
  }
  componentWillMount() {
    userStore.listen(this.onStoreChange)
  }
  componentWillUnmount() {
    userStore.unlisten(this.onStoreChange)
  }
  onStoreChange() {
    this.setState(this.getStateFromStores())
  }
  getStateFromStores() {
    return {
      user: userStore.getUser(),
      hasUser: userStore.hasUser()
    }
  }
  render() {
    return this.state.hasUser ?
      <UserDisplay user={this.state.user} /> :
      <UserForm />
  }
}
