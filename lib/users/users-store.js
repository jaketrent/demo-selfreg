import autobind from 'autobind-decorator'
import clone from 'lodash/lang/clone'
import EventEmitter from 'events'

import appDispatcher from '../common/app-dispatcher'
import constants from './users-constants'

@autobind
class UsersStore extends EventEmitter {
  constructor() {
    super()
    this._users = []
    this.dispatchToken = appDispatcher.register(this.handleMessage)
  }
  listen(listener) {
    this.addListener('change', listener)
  }
  unlisten(listener) {
    this.removeListener('change', listener)
  }
  getUsers() {
    return clone(this._users)
  }
  emitChange() {
    this.emit('change', arguments)
  }
  handleMessage(payload) {
    switch(payload.actionType) {
      case constants.FETCH_USERS_SUCCESS:
        this._users = this._users.concat(payload.users)
        this.emitChange()
        break

      case constants.CREATE_USER_SUCCESS:
        this._users = [ payload.user ].concat(this._users)
        this.emitChange()
        break
    }
  }
}

var usersStore = new UsersStore()

export default usersStore