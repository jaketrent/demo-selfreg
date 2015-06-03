import assign from 'lodash/object/assign'
import clone from 'lodash/lang/clone'
import EventEmitter from 'events'

import appDispatcher from '../common/app-dispatcher'
import constants from './users-constants'

var userStore = assign({}, EventEmitter.prototype, {
  listen(listener) {
    this.addListener('change', listener)
  },
  unlisten(listener) {
    this.removeListener('change', listener)
  },
  hasUser() {
    return !!this._user
  },
  setRegistration(user) {
    this._user = user
    this.emitChange()
  },
  getUser() {
    return clone(this._user)
  },
  emitChange() {
    this.emit('change', arguments)
  }
})
userStore.dispatchToken = appDispatcher.register(function (payload) {
  switch(payload.actionType) {
    case constants.CREATE_USER_SUCCESS:
      this._user = payload.user
      this.emitChange()
      break
  }
}.bind(userStore))

export default userStore