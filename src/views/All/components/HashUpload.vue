<template>
  <div class="single-upload upload-box">
    <h2>单一文件使用Hash传值[FORM-DATA],(文件过大时转hash值速度太慢)</h2>
    <div class="upload-box">
      <input type="file" ref="input" @change="inputChange">
      <div class="btn-box">
        <button class="choose-btn" @click="choose">
          <span v-if="!loading">上传</span>
          <div class="loading" v-else>
            <img class="loading-icon" src="@/assets/loading.png" alt="">
            <span>上传中...</span>
          </div>
        </button>
      </div>
      <p class="tips" v-if="!file"></p>
      <div v-if="imgUrl">
        <p class="tips">预览</p>
        <img class="img-show" :src="imgUrl" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { uploadHashSingle } from '@/api/index'
import { changeBuffer } from '@/utils/hash'
export default {
  name: 'SingleUpload',
  data () {
    return {
      loading: false,
      file: null,
      imgUrl: ''
    }
  },
  methods: {
    choose () {
      if (this.loading) return
      this.$refs.input.click()
    },
    async inputChange (e) {
      const file = e.target.files[0]
      if (!file) return
      this.file = file
      this.loading = true
      const hashResult = await changeBuffer(file)
      const fd = new FormData()
      fd.append('file', file)
      fd.append('filename', hashResult.filename)
      try {
        const result = await uploadHashSingle(fd)
        this.imgUrl = result.servicePath
        alert(`上传成功，通过${result.servicePath}访问`)
      } catch (error) {
        alert('上传失败，请重新上传！')
      } finally {
        this.finallyHandle()
      }
    },
    finallyHandle () {
      this.loading = false
      this.file = null
    }
  }
}
</script>

<style lang='scss' scoped>
.upload-box {
  width: 400px;
  h2 {
    font-size: 12px;
    margin-bottom: 13px;
  }
  .upload-box {
    width: 100%;
    height: 150px;
    border: 1px dashed #d1c6c6;
    padding: 10px 0 0 10px;
    input {
      display: none;
    }
    .btn-box {
      display: flex;
      margin-bottom: 10px;
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        box-sizing: border-box;
        line-height: 31px;
        font-size: 13px;
        border-radius: 5px;
        margin-right: 10px;
        border: none;
        color: #fff;
        .loading {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          .loading-icon {
            width: 20px;
            margin-right: 3px;
            animation: round 1s linear infinite;
          }
        }
        &:hover {
          cursor: pointer;
          opacity: .85;
        }
        &:nth-of-type(1) {
          background-color: #3893FD;
        }
        &:nth-of-type(2) {
          background-color: #5EBB33;
        }
      }
    }
    .tips {
      font-size: 12px;
      color: #C9C9C8;
    }
    .img-show {
      border-radius: 5px;
      max-height: 70px;
    }
    .lists-box {
      .list-item {
        font-size: 12px;
        color: #C9C9C8;
        span {
          margin-right: 10px;
          &.remove {
            color: red;
            cursor: pointer;
            &:hover {
              opacity: .7;
            }
          }
        }
      }
    }
  }
}
@keyframes round {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
