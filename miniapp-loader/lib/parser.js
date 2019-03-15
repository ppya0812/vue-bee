const compiler = require('vue-template-compiler')
const LRU = require('lru-cache')
const cache = new LRU(100)
const hash = require('hash-sum')

module.exports = (content, filename, sourceRoot) => {
  const cacheKey = hash(filename + content)
  let output = cache.get(cacheKey)
  if (output) return output
  output = compiler.parseComponent(content, {
    pad: 'line'
  })
  cache.set(cacheKey, output)
  return output
}
