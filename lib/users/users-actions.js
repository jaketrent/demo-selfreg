import * as apiHelpers from './users-api'
import appDispatcher from '../common/app-dispatcher'
import constants from './users-constants'
import usersApi from './users-api'

export function createUser(user) {
  apiHelpers.createUser(user)
  appDispatcher.dispatch({
    actionType: constants.CREATE_USER,
    user
  })
}

export function createUserSuccess(user) {
  appDispatcher.dispatch({
    actionType: constants.CREATE_USER_SUCCESS,
    user
  })
}

export function createUserError(user, errors) {
  appDispatcher.dispatch({
    actionType: constants.CREATE_USER_ERROR,
    user,
    errors
  })
}

export function fetchUsers() {
  apiHelpers.fetchUsers()
  appDispatcher.dispatch({
    actionType: constants.FETCH_USERS
  })
}

export function fetchUsersSuccess(users) {
  appDispatcher.dispatch({
    actionType: constants.FETCH_USERS_SUCCESS,
    users
  })
}

