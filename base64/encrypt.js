const { createCanvas } = require('canvas')
const fs = require('fs')
const file2Img = function (filename) {
  fs.readFile(filename, { encoding: 'utf8' }, function (_, data) {
    let length = data.length
    let size = Math.ceil(Math.sqrt(length))
    // 绘制canvas
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')
    // 获取透明像素数据
    var imgData = ctx.getImageData(0, 0, size, size)
    // 透明像素数据替换为实色数据
    var index = 0
    for (var start = 0; start < size * size; start++) {
      let charCode = data.charCodeAt(start)
      if (Number.isNaN(charCode) == false) {
        let hex = (charCode + '').padStart(6, '0')
        for (var i = 0; i < 6; i += 2) {
          imgData.data[index++] = parseInt('0x' + hex.slice(i, i + 2))
        }
        // 透明度
        imgData.data[index++] = 255
      }
    }
    // 使用新颜色信息绘制
    ctx.putImageData(imgData, 0, 0)

    // 保存的PNG文件名
    var imgFilename = filename.split('.')[0] + '.png'
    let stream = canvas.pngStream()
    // 输出PNG流
    let out = fs.createWriteStream(__dirname + '/' + imgFilename)
    stream.on('data', function (chunk) {
      out.write(chunk)
    })
    stream.on('end', function () {
      console.log('The ' + imgFilename + ' stream ended')
    })
  })
}

file2Img('font.js')
