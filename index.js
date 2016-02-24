'use strict'


const Quark = require('proton-quark')
const path = require('path')
const _ = require('lodash')

module.exports = class ExceptionsQuark extends Quark {

  constructor(proton) {
    super(proton)
  }

  configure() {
    if (!this.proton.app.exceptions)
      this.proton.app.exceptions = {}
    return true
  }

  initialize() {
    this._bindToApp()
    this._bindToProton()
  }

  _bindToApp() {
    const exceptionsPath = path.join(this.proton.app.path, '/exceptions')
    const exceptions = require('require-all')(exceptionsPath)
    _.forEach(exceptions, Exception => new Exception("Exception", this.proton))
  }

  _bindToProton() {
    this.proton.use(function*(next) {
      try {
        yield next
      } catch (err) {
        if (err.handle) {
          err.handle(this)
        } else {
          this.status = 500
          this.body = err.message
        }
        this.app.emit('error', err, this)
      }
    })
  }

}
