(function () {
  window.onerror = function (message) {
    window.parent.postMessage({ type: 'iframe-error', message }, '*')
  }
  window.addEventListener('unhandledrejection', e => {
    window.parent.postMessage({ type: 'iframe-error', message: e.reason.stack }, '*')
  })
  window.addEventListener('click', () => {
    window.parent.postMessage({ type: 'codepan-highlight-output' }, '*')
  })

  const stringify = (function () {
    /*
    Copyright (c) 2014, Yahoo! Inc. All rights reserved.
    Copyrights licensed under the New BSD License.
    See the accompanying LICENSE file for terms.
    */

    'use strict'

    const isRegExp = re => Object.prototype.toString.call(re) === '[object RegExp]'

    // Generate an internal UID to make the regexp pattern harder to guess.
    const UID = Math.floor(Math.random() * 0x10000000000).toString(16)
    const PLACE_HOLDER_REGEXP = new RegExp('"@__(F|R)-' + UID + '-(\\d+)__@"', 'g')

    const IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g
    const UNSAFE_CHARS_REGEXP = /[<>/\u2028\u2029]/g

    // Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
    // Unicode char counterparts which are safe to use in JavaScript strings.
    const ESCAPED_CHARS = {
      '<': '\\u003C',
      '>': '\\u003E',
      '/': '\\u002F',
      '\u2028': '\\u2028',
      '\u2029': '\\u2029'
    }

    function escapeUnsafeChars(unsafeChar) {
      return ESCAPED_CHARS[unsafeChar]
    }

    return function (obj, options) {
      options || (options = {})

        // Backwards-compatability for `space` as the second argument.
      if (typeof options === 'number' || typeof options === 'string') {
        options = { space: options }
      }

      const functions = []
      const regexps = []

        // Returns placeholders for functions and regexps (identified by index)
        // which are later replaced by their string representation.
      function replacer(key, value) {
        if (!value) {
          return value
        }

        const type = typeof value

        if (type === 'object') {
          if (isRegExp(value)) {
            return '@__R-' + UID + '-' + (regexps.push(value) - 1) + '__@'
          }

          return value
        }

        if (type === 'function') {
          return '@__F-' + UID + '-' + (functions.push(value) - 1) + '__@'
        }

        return value
      }

      let str

        // Creates a JSON string representation of the value.
        // NOTE: Node 0.12 goes into slow mode with extra JSON.stringify() args.
      if (options.isJSON && !options.space) {
        str = JSON.stringify(obj)
      } else {
        str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space)
      }

        // Protects against `JSON.stringify()` returning `undefined`, by serializing
        // to the literal string: "undefined".
      if (typeof str !== 'string') {
        return String(str)
      }

        // Replace unsafe HTML and invalid JavaScript line terminator chars with
        // their safe Unicode char counterpart. This _must_ happen before the
        // regexps and functions are serialized and added back to the string.
      str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars)

      if (functions.length === 0 && regexps.length === 0) {
        return str
      }

        // Replaces all occurrences of function and regexp placeholders in the JSON
        // string with their string representations. If the original value can not
        // be found, then `undefined` is used.
      return str.replace(PLACE_HOLDER_REGEXP, (match, type, valueIndex) => {
        if (type === 'R') {
          return regexps[valueIndex].toString()
        }

        const fn = functions[valueIndex]
        const serializedFn = fn.toString()

        if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
          throw new TypeError('Serializing native function: ' + fn.name)
        }

        return serializedFn
      })
    }
  })()
  /** =========================================================================
   * Console
   * Proxy console.logs out to the parent window
   * ========================================================================== */

  const proxyConsole = (function () {
    const ProxyConsole = function () {}

    /**
     * Stringify all of the console objects from an array for proxying
     */
    const stringifyArgs = function (args) {
      const newArgs = []
      // TODO this was forEach but when the array is [undefined] it wouldn't
      // iterate over them
      let i = 0
      const length = args.length
      let arg
      for (; i < length; i++) {
        arg = args[i]
        if (typeof arg === 'undefined') {
          newArgs.push('undefined')
        } else {
          newArgs.push(stringify(arg, { space: 2 }))
        }
      }
      return newArgs
    }

    // Create each of these methods on the proxy, and postMessage up to JS Bin
    // when one is called.
    const methods = ProxyConsole.prototype.methods = [
      'debug', 'clear', 'error', 'info', 'log', 'warn', 'dir', 'props', '_raw',
      'group', 'groupEnd', 'dirxml', 'table', 'trace', 'assert', 'count',
      'markTimeline', 'profile', 'profileEnd', 'time', 'timeEnd', 'timeStamp',
      'groupCollapsed'
    ]

    methods.forEach(method => {
      // Create console method
      const originalMethod = console[method]
      const originalClear = console.clear
      ProxyConsole.prototype[method] = function () {
        // Replace args that can't be sent through postMessage
        const originalArgs = [].slice.call(arguments)
        const args = stringifyArgs(originalArgs)

        // Post up with method and the arguments
        window.parent.postMessage({
          type: 'codepan-console',
          method: method === '_raw' ? originalArgs.shift() : method,
          args: method === '_raw' ? args.slice(1) : args
        }, '*')

        // If the browner supports it, use the browser console but ignore _raw,
        // as _raw should only go to the proxy console.
        // Ignore clear if it doesn't exist as it's beahviour is different than
        // log and we let it fallback to jsconsole for the panel and to nothing
        // for the browser console
        if (!originalMethod) {
          method = 'log'
        }

        if (method !== '_raw') {
          if (method !== 'clear' || (method === 'clear' && originalClear)) {
            originalMethod.apply(ProxyConsole, originalArgs)
          }
        }
      }
    })

    return new ProxyConsole()
  })()

  window.console = proxyConsole
})(); // eslint-disable-line semi
