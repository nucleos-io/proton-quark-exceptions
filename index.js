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
    const exceptionsPath = path.join(this.proton.app.path, '/exceptions')
    const exceptions = require('require-all')(exceptionsPath)
    _.forEach(exceptions, Exception => new Exception(this.proton))
  }

}
