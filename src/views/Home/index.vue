<template>
  <div class="home">
    <nav>
      <router-link :to="{ name: 'LargeFileSlice' }">大文件切片上传</router-link>
      <router-link to="/iframe">iframe传值（侵入式）</router-link>
      <router-link to="/all-fun">所有功能（上传/缩略/切片）</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'MHome'
}
</script>

<style lang='scss' scoped>
nav {
  text-align: center;
  margin: 0 auto;
  padding-top: 200px;
  a {
    margin-right: 20px;
    &:hover {
      color: blue;
    }
  }
}
</style>
