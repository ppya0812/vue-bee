const path = require('path')
const logger = require('../lib/logger.js')
const readFileList = require('../lib/readFileList')

module.exports = function list() {
  const cwd = path.join(process.cwd(), '/template')
  const fileList = readFileList(cwd)
  // 从template目录中读取除node_modules目录下的所有文件并筛选处理
  logger.success(fileList.map(v => {
    return `${v.path.replace(process.cwd(), '')}  ${v.size}KB`
  }))
}
