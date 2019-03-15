const fs = require('fs')
fs.readFile('./font.png', 'hex', function (_, data) {
  console.log(data)
  fs.writeFile('./base64', data, function (err) {
    if (err) {
      throw err
    }
    console.log("It's  saved!") // 文件被保存
  })
})

// const readStream = fs.createReadStream('./font.png')
// readStream.on('data', function (data) {
//   console.log(data)
//   const result = new TextEncoder('utf-8').encode(data)
//   console.log('result', result)
// })
