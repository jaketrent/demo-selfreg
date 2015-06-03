import autobind from 'autobind-decorator'
import clone from 'lodash/lang/clone'
import EventEmitter from 'events'

import appDispatcher from '../common/app-dispatcher'
import constants from './users-constants'

@autobind
class UserStore extends EventEmitter {
  constructor() {
    super()
    this._user = null
    this.dispatchToken = appDispatcher.register(this.handleMessage)
  }
  listen(listener) {
    this.addListener('change', listener)
  }
  unlisten(listener) {
    this.removeListener('change', listener)
  }
  hasUser() {
    return !!this._user
  }
  setRegistration(user) {
    this._user = user
    this.emitChange()
  }
  getUser() {
    return clone(this._user)
  }
  emitChange() {
    this.emit('change', arguments)
  }
  handleMessage(payload) {
    switch(payload.actionType) {
      case constants.CREATE_USER_SUCCESS:
        this._user = payload.user
        this.emitChange()
        break
    }
  }
}

var userStore = new UserStore()

export default userStore