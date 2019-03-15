const chalk = require('chalk')
const format = require('util').format

const prefix = '   ' + chalk.dim('[ ') + 'bee' + chalk.dim(' ]')
const sep = chalk.gray('·')

exports.fatal = function (...args) {
  if (args[0] instanceof Error) args[0] = args[0].message.trim()
  const msg = format.apply(format, args)
  console.error(chalk.red(prefix), sep, chalk.magenta(msg))
  process.exit(1)
}

exports.success = function (args) {
  if (Object.prototype.toString.call(args) === '[object Array]') {
    console.log(chalk.greenBright(prefix), sep)
    args.length && args.forEach(v => {
      console.log('     ' + chalk.green('★ ') + chalk.yellowBright(v))
    })
  } else {
    console.log(chalk.greenBright(prefix), sep, chalk.yellowBright(args))
  }
}
