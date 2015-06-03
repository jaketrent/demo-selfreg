import React from 'react'

class UserRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.user.firstName}</td>
        <td>{this.props.user.lastName}</td>
        <td>{this.props.user.email}</td>
      </tr>
    )
  }
}

export default class UsersTable extends React.Component {
  static defaultProps = {
    users: []
  }
  renderHeader() {
    return (
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
        </tr>
      </thead>
    )
  }
  renderUserRows(users) {
    return users.map((user, i) => {
      return <UserRow user={user} key={i} />
    })
  }
  render() {
    return (
      <table>
        {this.renderHeader()}
        <tbody>
          {this.renderUserRows(this.props.users)}
        </tbody>
      </table>
    )
  }
}