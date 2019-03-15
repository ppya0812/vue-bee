const path = require('path')
const loaderUtils = require('loader-utils')
const parser = require('./parser')
const templateCompiler = require('./compiler/template')
const scriptCompiler = require('./compiler/script')
const styleCompiler = require('./compiler/style')

module.exports = function (source) {
  // 让loader缓存
  this.cacheable && this.cacheable()
  const query = loaderUtils.getOptions(this) || {}
  const options = Object.assign({
    esModule: true
  }, query)
  if (options.extra) {
    options.esModule = false
  }

  const filePath = this.resourcePath
  const fileName = path.basename(filePath)
  const context = (this._compiler && this._compiler.context) ||
    this.options.context ||
    process.cwd()
  const sourceRoot = path.dirname(path.relative(context, filePath))
  const parts = parser(
    source,
    fileName,
    sourceRoot
  )
  templateCompiler.call(this, parts.template)
  styleCompiler.call(this, parts.styles[0])
  scriptCompiler.call(this, parts.script)

  return ''
}
