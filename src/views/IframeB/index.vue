<template>
  <div class="iframe">
    这是同域名子页面<br>
    自动修改父级内容
  </div>
</template>

<script>
export default {
  name: 'IFrameB',
  mounted () {
    window.parent.document.querySelector('.parent-content').innerHTML = '这是修改后的内容'
  }
}
</script>

<style lang='scss' scoped>
.iframe {
  padding: 100px;
  border: 1px solid rgb(161, 157, 157);
}
</style>
