<template>
  <div class="single-upload upload-box">
    <h2>单一文件上传[BASE64],只适合图片</h2>
    <div class="upload-box">
      <input type="file" ref="input" accept=".png,.jepg,.jpg" @change="inputChange">
      <div class="btn-box">
        <button class="choose-btn" @click="choose">
          <span v-if="!loading">上传图片</span>
          <div class="loading" v-else>
            <img class="loading-icon" src="@/assets/loading.png" alt="">
            <span>上传中...</span>
          </div>
        </button>
      </div>
      <p class="tips" v-if="!file">只能上传PNG/JPG/JPEG格式图片，且大小不能超过2MB</p>
      <div v-if="imgUrl">
        <p class="tips">预览</p>
        <img class="img-show" :src="imgUrl" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { uploadBase64 } from '@/api/index'
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
      const base64Result = await this.changeBASE64(file)
      try {
        const result = await uploadBase64({
          file: base64Result,
          filename: file.name
        })
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
    },
    changeBASE64 (file) {
      return new Promise(resolve => {
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = () => {
          resolve(fr.result)
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.upload-box {
  width: 400px;
  h2 {
    font-size: 16px;
    margin-bottom: 8px;
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
