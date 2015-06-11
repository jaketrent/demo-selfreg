import autobind from 'autobind-decorator'
import clone from 'lodash/lang/clone'
import EventEmitter from 'events'

import appDispatcher from '../common/app-dispatcher'
import constants from './users-constants'

@autobind
class UserFormStore extends EventEmitter {
  constructor() {
    super()
    this._user = {}
    this._errors = {}
    this.dispatchToken = appDispatcher.register(this.handleMessage)
  }
  listen(listener) {
    this.addListener('change', listener)
  }
  unlisten(listener) {
    this.removeListener('change', listener)
  }
  getUser() {
    return clone(this._user)
  }
  getErrors() {
    return clone(this._errors)
  }
  emitChange() {
    this.emit('change', arguments)
  }
  handleMessage(payload) {
    switch(payload.actionType) {
      case constants.CREATE_USER_SUCCESS:
        this._user = {}
        this._errors = {}
        this.emitChange()
        break

      case constants.CREATE_USER_ERROR:
        this._user = payload.user
        this._errors = payload.errors
        this.emitChange()
        break
    }
  }
}

var userFormStore = new UserFormStore()

export default userFormStore