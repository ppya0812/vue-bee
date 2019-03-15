const Metalsmith = require('metalsmith')
const path = require('path')
const rm = require('rimraf').sync
const chalk = require('chalk')

module.exports = function generate() {
  const cwd = path.join(process.cwd(), '/template')
  Metalsmith(process.cwd())
    .metadata({
      name: 'test'
    }) // metadata 为用户输入的内容
    .clean(false)
    .source(cwd) // 模板文件 path
    .destination(path.join(process.cwd(), '/test')) // 最终编译好的文件存放位置
    .use((files, metalsmith, done) => {
      Object.keys(files).forEach(fileName => { // 遍历替换模板
        console.log('fileName', fileName)
        // if (!_.startsWith(fileName, 'src/font')) { // 判断是否为字体文件，字体文件不用替换
        const fileContentsString = files[fileName].contents.toString() // Handlebar compile 前需要转换为字符创
        files[fileName].contents = new Buffer(fileContentsString.replace('index', 'test'))
        // files[fileName].contents = new Buffer(Handlebars.compile(fileContentsString)(metalsmith.metadata()))
        // }
      })
      done()
    }).build(err => { // build
      rm('source') // 删除下载下来的模板文件，‘source’是路径
      if (err) {
        console.log(chalk.red(`Metalsmith build error: ${err}`))
      } else {}
    })
}
