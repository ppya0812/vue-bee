## 1. base64

<!-- data:image/png;base64, -->

位(bit): 计算机中最小的数据单位。每一位的状态只能是 0 或 1；
字节：8 个二进制位构成 1 个"字节(Byte)"，字节是存储空间的基本计量单位。1 个字节可以储存 1 个英文字母，2 个字节可以存储 1 个汉字；

- 字符串以 3 个 8bit 的字符为一组
- 每组获取每个字符的 ASCII 编码
- 将 ASCII 编码转换成 8bit 的二进制，得到一组 3\*8=24bit 字节
- 将 24bit 划分为 4 个 6bit 的字节，并在每个 6bit 的字节前面都填两个高位 0，得到 4 个 8bit 的字节
- 将这 4 个 8bit 的字节转换成 10 进制，对照 Base64 编码表 （下表），得到对应编码后的字符

##### \* 注：

1. 要求被编码字符是 8bit 的，所以须在 ASCII 编码范围内，\u0000-\u00ff，中文就不行。
2. 如果被编码字符长度不是 3 的倍数的时候，则都用 0 代替，对应的输出字符为=

T o m
ASCII: 84 111 109
8bit 字节: 01010100 01101111 01101101
6bit 字节: 010101 000110 111101 101101
十进制: 21 6 61 45
对应编码: V G 9 t

##### \* Base64 编码的原理 【只是从二进制到字符的转换过程】

Base64 可以将 ASCII 字符串或者是二进制编码成只包含 A—Z，a—z，0—9，+，/ 这 64 个字符（ 26 个大写字母，26 个小写字母，10 个数字，1 个+，一个 / 刚好 64 个字符）。这 64 个字符用 6 个 bit 位就可以全部表示出来，一个字节有 8 个 bit 位，那么还剩下两个 bit 位，这两个 bit 位用 0 来补充。其实，一个 Base64 字符仍然是 8 个 bit 位，但是有效部分只有右边的 6 个 bit，左边两个永远是 0。

Base64 的编码规则是将 3 个 8 位字节(3×8=24 位)编码成 4 个 6 位的字节(4×6=24 位)，之后在每个 6 位字节前面，补充两个 0，形成 4 个 8 位字节的形式，那么取值范围就变成了 0~63。又因为 2 的 6 次方等于 64，所以每 6 个位组成一个单元。

（Base64 将 3 个字节转变为 4 个字节，因此，编码后的代码量（以字节为单位）约比编码前的代码量多了 1/3）

## 2. base64 编解码

- **btoa()** 函数能够从二进制数据“字符串”创建一个 base-64 编码的 ASCII 字符串
- **atob()** 函数能够解码通过 base-64 编码的字符串数据。

  ```
  console.log(btoa('Tom')); //'VG9t'
  console.log(atob('VG9t')); //'Tom'
  ```

- 以上不能支持转化中文。支持中文：将中文 encodeURI，再进行 base64 编码

  ```
    var str = btoa(encodeURI('小火柴'));
    console.log(str);//JUU1JUIwJThGJUU3JTgxJUFCJUU2JTlGJUI0
    console.log(decodeURI(atob(str)));//'小火柴'
  ```

## 3.canvas.toDataURL()

canvas.toDataURL() 首先把图像转成 PNG 数据（rgba），然后再把得到的二进制的 PNG 数据转成纯 ASCII 的 base64 编码的字符串。
（将文件的完整二进制数据每八位一组转化为 ascii 字符，然后 base64）

### 3.1 编码

将图片的像素数值数据转换为二进制序列；
将宽度和高度信息组合成字符串 $$width,height$$，转换为二进制序列；
将图片像素信息的二进制序列和图片宽高度的二进制序列组合起来，然后再进行 Base64 的编码

```
function img2Base64(img) {
  var imgData = getPixels(img).data;
  var imgWidth = getPixels(img).width;
  var imgHeight = getPixels(img).height;
  var bin = "";
  for (var i = 0; i < imgData.length; i++) {
    bin += base.numToString(imgData[i]);
  }
  bin = bin + base.stringToBin("$$" + imgWidth + "," + imgHeight + "$$");
  return base.binToBase64(bin);
}
```

### 3.2. 解码

将图片的 Base64 信息进行解码，得到包含图片像素信息和宽高度信息的二进制序列；
然后将这个二进制序列解码成字符串，获取高度和宽度信息；
去除二进制序列中的高度和宽度信息，得到像素信息；
根据像素信息生成像素矩阵；
根据像素矩阵、宽度和高度创建图片对象 ImageData；
利用 putImageData 将图像绘制出来。

```
// 逆解码
      function paint (imgData) {
        var canvas = document.getElementById('canvas2')
        var ctx = canvas.getContext('2d')
        ctx.fillRect(0, 0, imgData.width, imgData.height)
        ctx.putImageData(imgData, 0, 0)
      }

      function base642img (data) {
        var str = base.BinToStr(base.base64ToBin(data))
        var imgWidth = str.match(/\$\$(\d+),(\d+)\$\$$/, '')[1]
        var imgHeight = str.match(/\$\$(\d+),(\d+)\$\$$/, '')[2]
        var imgData = base
          .base64ToBin(data)
          .replace(
            base.stringToBin('$$' + imgWidth + ',' + imgHeight + '$$'),
            ''
          )

        var ImageDataArray = new Uint8ClampedArray(imgWidth * imgHeight * 4)
        for (var i = 0; i < ImageDataArray.length; i++) {
          ImageDataArray[i] = parseInt(imgData.substr(i * 8, 8), 2)
        }
        return new ImageData(ImageDataArray, imgWidth, imgHeight)
      }
```

## 6. blob, filereader

```
  function getBase64 (imgUrl) {
    window.URL = window.URL || window.webkitURL
    var xhr = new XMLHttpRequest()
    xhr.open('get', imgUrl, true)
    // 至关重要
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status === 200) {
        // 得到一个blob对象
        var blob = this.response
        //  至关重要
        let oFileReader = new FileReader()
        oFileReader.onloadend = function (e) {
          let base64 = e.target.result
          console.log('方式一》》》》》》》》》', base64)
        }
        oFileReader.readAsDataURL(blob)

        //= ===为了在页面显示图片，可以删除====
        // var img = document.createElement('img')
        // img.onload = function (e) {
        //   window.URL.revokeObjectURL(img.src) // 清除释放
        // }
        // let src = window.URL.createObjectURL(blob)

        // img.src = src
        // document.getElementById('container1').appendChild(img)
        //= ===为了在页面显示图片，可以删除====
      }
    }
    xhr.send()
  }
  getBase64(url)
```

---

## 7. 纯 base64 如何解码

第一步，将每 4 个字符为一组，查找上表，找到每个字符对应的 ASCII 值
第二步，将 4 个 ASCII 值写成二进制形式，并将每个二进制的前 2 个 00 去掉
第三步，将剩下的 24 位二进制位分成 3 份，即 3 个字节
第四步，查找 ASCII 值表（下表），找到每个字节对应的字符。

## 8.图片 Png 数据

### 8.1 像素点信息获取 ctx.getImageData(0, 0, w, h) uint8ClampedArray

imageData.data 就是我们需要的像素点信息数组，是个一维数组，类型为 Uint8ClampedArray，Uint 表示自然数，8 可以理解为数值范围不超过 2 的 8 次方，也就是不超过 256。所以这个数组中所有的值范围都是 0~255。

imageData.data 这个数组表示的是像素点的 RGBA 颜色信息，由于类型为一维数组，因此，RGBA 颜色信息被按顺序作为 4 个独立的数组项依次排列的。

加上一张图片，只有两个像素点，分别是纯黑色和纯白色，使用 CSS3 的 RGBA 颜色表示就是 rgba(0,0,0,1)以及 rgba(255,255,255,1)，其中 RGB 颜色和 canvas 中的 ImageData 范围一致，是 0~255，但这个与透明度相关的 A 需要转换下，0->0，1->255。

### 8.2 关键坐标获取

算法如下，水平和垂直方向均以固定间隙去读取 imageData 像素点信息，如果是完全不透明的像素点，则作为我们需要的关键坐标保存下来。

```
  var imgData = context.getImageData(0,0,width,height).data;
  // 间隙大小为13
  var gap = 13;
  var pos = [];
  var x = 0, y = 0, index = 0;
  for (var i=0; i<imgData.length; i+=(4*gap)) {
      if (imgData[i+3] == 255) {
          // 塞入此时的坐标
          pos.push({
              x: x,
              y: y
          });
      }
      index = Math.floor(i / 4);
      x = index % width;
      y = Math.floor(index / width);
      if (x >= width - gap) {
          i += gap * 4 * width;
      }
  }

  // pos就是我们需要的关键点坐标集合
```
