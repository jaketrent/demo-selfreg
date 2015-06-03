import React from 'react'

export default class UserDisplay extends React.Component {
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
