const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const vfs = require('vinyl-fs')
const through = require('through2')
const fs = require('fs-extra')
const logger = require('../lib/logger.js')

function init() {
  // 获取将要构建的项目根目录
  if (program.init === true) {
    program.init = 'myProject'
  }
  const projectPath = path.resolve(program.init)
  // 获取将要构建的的项目名称
  const projectName = path.basename(projectPath)

  console.log(`Start to init a project in ${chalk.green(projectPath)}`)
  // 根据将要构建的项目名称创建文件夹
  fs.ensureDirSync(projectName)
  // 获取本地模板目录
  const cwd = path.join(process.cwd(), '/template')
  // 从template目录中读取除node_modules目录下的所有文件并筛选处理
  vfs
    .src(['**/*', '!node_modules/**/*'], {
      cwd: cwd,
      dot: true
    })
    // .pipe(map((file, cb) => {
    //   console.log(file.path)
    //   cb(null, file)
    // }))
    // .pipe(vfs.dest(projectPath))
    // through2 处理 streams.Transform
    .pipe(through.obj(function (file, enc, callback) {
      if (!file.stat.isFile()) {
        return callback()
      }
      this.push(file)
      return callback()
    }))
    // 往磁盘写文件
    .pipe(vfs.dest(projectPath))
    .on('end', () => {
      logger.success(`dest finish!!`)
      const hasPackage = fs.existsSync(path.join(projectPath, '/package.json'))
      if (hasPackage) {
        console.log('start install package...')
        // 将node工作目录更改成构建的项目根目录下
        process.chdir(projectPath)
        // 执行安装命令
        require('../lib/install')
      }
    })
    .resume()
}

module.exports = init
