import assign from 'lodash/object/assign'
import omit from 'lodash/object/omit'
import axios from 'axios'

import * as actions from './users-actions'

export async function createUser(user) {
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