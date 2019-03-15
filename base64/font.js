var isSupportFontFamily = function (f) {
  if (typeof f !== 'string') {
    return false
  }
  var h = 'Arial'
  if (f.toLowerCase() == h.toLowerCase()) {
    return true
  }
  var e = 'a'
  var d = 100
  var a = 100

  var i = 100
  var c = document.createElement('canvas')
  var b = c.getContext('2d')
  c.width = a
  c.height = i
  b.textAlign = 'center'
  b.fillStyle = 'black'
  b.textBaseline = 'middle'
  var g = function (j) {
    b.clearRect(0, 0, a, i)
    b.font = d + 'px ' + j + ', ' + h
    b.fillText(e, a / 2, i / 2)
    var k = b.getImageData(0, 0, a, i).data
    return [].slice.call(k).filter(function (l) {
      return l != 0
    })
  }
  return g(h).join('') !== g(f).join('')
}
