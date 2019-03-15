const DOMParser = require('xmldom').DOMParser

const string = `<template>
<div>
  hhhh
</div>
</template>

<script>
export default {
name: 'indexId'
}
</script>

<style lang="less" scoped>
.index {
color: red;
}
</style>
`

const doc = new DOMParser().parseFromString(string)
console.log(doc)
