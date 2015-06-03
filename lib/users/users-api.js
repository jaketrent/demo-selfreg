import assign from 'lodash/object/assign'
import omit from 'lodash/object/omit'
import axios from 'axios'

import * as actions from './users-actions'

function deserializeUser(apiUser) {
  return omit(apiUser, 'type', 'links')
}

export async function createUser(user) {
  function serialize(rawUser) {
    return {
      data: assign({}, rawUser, {
        type: 'users'
      })
    }
  }

  var res = await axios({
    method: 'post',
    url: 'http://demo-users-api.herokuapp.com/api/v1/users',
    headers: { 'Content-Type': 'application/vnd.api+json' },
    data: serialize(user)
  })
  actions.createUserSuccess(deserializeUser(res.data.data))
}

export async function fetchUsers() {
  function deserialize(apiUsers) {
    return apiUsers.data.map(deserializeUser)
  }

  var res = await axios({
    url: 'http://demo-users-api.herokuapp.com/api/v1/users',
    headers: { 'Content-Type': 'application/vnd.api+json' }
  })
  actions.fetchUsersSuccess(deserialize(res.data))
}