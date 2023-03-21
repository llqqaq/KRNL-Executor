<template>
  <div class="all-fun">
    <!-- 单一文件上传 -->
    <single-upload class="upload-item"></single-upload>
    <!-- Base64上传 -->
    <base-upload></base-upload>
    <!-- Hash只值 -->
    <hash-upload></hash-upload>
    <!-- 单文件进度条 -->
    <single-percent-upload></single-percent-upload>
    <!-- 多文件上传 -->
    <multiple-upload></multiple-upload>
    <!-- 拖拽上传 -->
    <drap-upload></drap-upload>
    <!-- 切片上传 -->
    <split-upload></split-upload>
  </div>
</template>

<script>
import SingleUpload from './components/SingleUpload.vue'
import BaseUpload from './components/Base64Upload.vue'
import HashUpload from './components/HashUpload.vue'
import SinglePercentUpload from './components/SinglePercentUpload.vue'
import MultipleUpload from './components/MultipleUpload.vue'
import DrapUpload from './components/DrapUpload.vue'
import SplitUpload from './components/SplitUpload.vue'
export default {
  name: 'AllFun',
  components: {
    SingleUpload,
    BaseUpload,
    HashUpload,
    SinglePercentUpload,
    MultipleUpload,
    DrapUpload,
    SplitUpload
  }
}
</script>

<style lang='scss' scoped>
.all-fun {
  width: 1300px;
  margin: 0 auto;
  padding-top: 50px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .upload-item {
    margin-bottom: 30px;
  }
}
</style>
