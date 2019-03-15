const fs = require('fs')

function walk(file, cwd, filesList) {
  let states = fs.statSync(cwd + '/' + file)
  if (states.isDirectory()) {
    readFileList(cwd + '/' + file, filesList)
  } else {
    // 创建一个对象保存信息
    let obj = Object.create({})
    obj.size = states.size // 文件大小，以字节为单位
    obj.name = file // 文件名
    obj.path = cwd + '/' + file // 文件绝对路径
    filesList.push(obj)
  }
}

function readFileList(cwd, filesList = []) {
  let files = fs.readdirSync(cwd) // 需要用到同步读取
  files.forEach(v => {
    walk(v, cwd, filesList)
  })
  return filesList
}

module.exports = readFileList
