import autobind from 'autobind-decorator'
import React from 'react'

import * as actions from './users-actions'
import UserForm from './user-form'
import UsersTable from './users-table'
import usersStore from './users-store'

@autobind
export default class App extends React.Component {
  constructor() {
    super()
    this.state = this.getStateFromStores()
  }
  componentWillMount() {
    usersStore.listen(this.onStoreChange)
    actions.fetchUsers()
  }
  componentWillUnmount() {
    usersStore.unlisten(this.onStoreChange)
  }
  onStoreChange() {
    this.setState(this.getStateFromStores())
  }
  getStateFromStores() {
    return {
      users: usersStore.getUsers()
    }
  }
  render() {
    return (
      <div>
        <UserForm />
        <UsersTable users={this.state.users} />
      </div>
    )
  }
}
