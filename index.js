const fs = require('fs')

/**
 * Utility functions for node environment
 * Make sure to turn relative paths into absolute before passing to functions.
 */
class NodeFunctions {
  /**
     * Requires file without using "require".
     * Achieves via readFileSync + eval.
     *
     * @param {String} url
     * @param {String} encoding
     * @return {String} file data
     */
  static requireFile (url, encoding) {
    if (!encoding) {
      encoding = 'utf8'
    }

    return window.eval(fs.readFileSync(url, encoding))
  }

  /**
     * Performs browserify on folder.
     *
     * @param {String} source
     * @param {String} bundleFile
     */
  static browserifyFolder (source, bundleFile) {
    const browserify = require('browserify')
    const fs = require('fs')
    const path = require('path')

    const getStream = (url) => {
      return fs.createWriteStream(url, {
        encoding: 'utf-8'
      })
    }
    const bundle = (urls, stream) => {
      const b = browserify()
      urls.forEach((url) => {
        b.add(url)
      })
      b.bundle().pipe(stream)
    }
    const getFolderFileUrls = (url) => {
      let names = fs.readdirSync(url)
      let urls = names.map((name) => {
        return path.join(url, name)
      })

      return urls
    }

    const stream = getStream(bundleFile)
    const readUrl = path.join(source)
    const urls = getFolderFileUrls(readUrl)
    bundle(urls, stream)
  }

  /**
   * Converts simple script javascript to ES6 module.
   * Only sync.
   * @param {String} code
   * @param {String} varName
   * @return {String}
   */
  static scriptToES6Module (code = '', varName) {
    return `${code}
    export default window[${varName}]`
  }

  /**
   * Converts simple script javascript to Common JS module.
   * Only sync.
   * @param {String} code
   * @param {String} varName
   * @return {String}
   */
  static scriptToCommonJSModule (code = '', varName) {
    return `${code}
    module.exports = window[${varName}]`
  }
}

module.exports = NodeFunctions
