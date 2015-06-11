import assign from 'lodash/object/assign'
import omit from 'lodash/object/omit'
import axios from 'axios'

import * as actions from './users-actions'

function camelize(str) {
  return str.replace (/(?:[-_])(\w)/g, function (_, c) {
    return c ? c.toUpperCase () : '';
  })
}

function deserializeUser(apiUser) {
  return omit(apiUser, 'type', 'links')
}

// api error format doesn't follow jsonapi spec :(
function deserializeErrors(apiRes) {
  function formatId(error) {
    return camelize(error.path.substr(1)) // strip leading '/'
  }

  function formatError(error) {
    return error.detail
  }

  let errors = apiRes.data.errors.reduce((memo, error) => {
    let id = formatId(error)
    let formattedErr = formatError(error)
    memo[id] = (memo[id] || []).concat([ formattedErr ])
    return memo
  }, {})

  return {
    errors,
    statusCode: apiRes.status
  }
}

export async function createUser(user) {
  function serialize(rawUser) {
    return {
      data: assign({}, rawUser, {
        type: 'users'
      })
    }
  }
  try {
    let res = await axios({
      method: 'post',
      url: 'http://demo-users-api.herokuapp.com/api/v1/users',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      data: serialize(user)
    })
    actions.createUserSuccess(deserializeUser(res.data.data))
  } catch (res) {
    actions.createUserError(user, deserializeErrors(res))
  }
}

export async function fetchUsers() {
  function deserialize(apiUsers) {
    return apiUsers.data.map(deserializeUser)
  }

  let res = await axios({
    url: 'http://demo-users-api.herokuapp.com/api/v1/users',
    headers: { 'Content-Type': 'application/vnd.api+json' }
  })
  actions.fetchUsersSuccess(deserialize(res.data))
}