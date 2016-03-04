'use strict'


const Quark = require('proton-quark')
const path = require('path')
const _ = require('lodash')
const stackTrace = require('stack-trace')

/**
 * @class ExceptionsQuark
 * @classdesc This quark is for expose as global the proton exceptions
 * @author Luis Hernandez
 */
class ExceptionsQuark extends Quark {

  constructor(proton) {
    super(proton)
  }

  /**
   * @override
   * @method configure
   * @description Ask if the proton.app.exceptions object exist, if not exist
   * the method create the proton.app.exceptions object
   * @author Luis Hernandez
   */
  configure() {
    if (!this.proton.app.exceptions)
      this.proton.app.exceptions = {}
    return true
  }

  /**
   * @override
   * @method initialize
   * @description bind to the app object every exceptions and bind to proton an
   * error manager
   * @author Luis Hernandez
   */
  initialize() {
    _.forEach(this._exceptions, exception => {
      exception.expose(exception)
      this._addExceptionToApp(exception)
    })
    this.proton.use(this.exceptionManager)
  }

  /**
   * @override
   * @method _addExceptionToApp
   * @description Add to the app exception object the exceptions
   * @author Luis Hernandez
   */
  _addExceptionToApp(exception) {
    this.proton.app.exceptions[exception.name] = exception
  }

  get _exceptions() {
    const exceptionsPath = path.join(this.proton.app.path, '/exceptions')
    return require('require-all')(exceptionsPath)
  }

  * exceptionManager(next) {
    try {
      yield next
    } catch (err) {
      const trace = stackTrace.parse(err)
      console.log(trace)
    }
  }

}

module.exports = ExceptionsQuark
