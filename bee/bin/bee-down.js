const inquirer = require('inquirer')
const program = require('commander')
const download = require('download-git-repo')
const ora = require('ora')
const rm = require('rimraf').sync
const fs = require('fs-extra')
const logger = require('../lib/logger.js')

module.exports = function down() {
  const list = [{
    name: '111'
  }, {
    name: '222'
  }]

  // inquirer
  const question = [{
      type: 'list',
      message: 'Select the templates which you want to init',
      default: {
        name: 'cancel'
      },
      name: 'template',
      choices: [{
          name: 'cancel',
          checked: true
        },
        new inquirer.Separator('= Available template list = ')
      ].concat(list)
    },
    {
      type: 'input',
      message: 'Project name',
      name: 'name',
      when: function (answers) {
        return answers.template !== 'cancel'
      },
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must be entry project name'
        }
        return true
      }
    }
  ]

  function generateFile(answers, projectPath) {
    console.log('answers', answers)
    const spinner = ora('downloading template').start()
    const clone = program.clone || false
    // if (fs.existsSync(temp)) rm(temp)
    download('ppya0812/vue-upload', answers.name, {
      clone
    }, err => {
      if (err) {
        spinner.fail('Failed to download repo ' + 'template' + ': ')
        logger.fatal(err.message.trim())
        return
      }

      spinner.succeed()
      // logger.success('Successed to download template "%s".', pkg.name)
    })
  }
  inquirer.prompt(question).then(answers => {
    if (answers.name) {
      const projectPath = `${process.cwd()}/${answers.name}`
      const buildDir = fs.existsSync(projectPath) && fs.readdirSync(projectPath)
      if (buildDir && buildDir.length) {
        inquirer.prompt([{
          type: 'confirm',
          message: 'Target directory exists. Do you want to save current files',
          name: 'save'
        }, {
          type: 'confirm',
          message: 'current files will be clean, Do you sure to do that',
          name: 'clean',
          when: function (answers) {
            return !answers.save
          }
        }]).then(clean => {
          console.log('clean', clean)
          generateFile(answers, projectPath)
          // run({...answers, ...clean}, projectPath)
        })
      } else {
        console.log('you can create file')
        generateFile(answers, projectPath)
      }
    }
  })
}
