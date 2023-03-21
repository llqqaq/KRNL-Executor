<template>
  <div class="single-upload upload-box">
    <h2>单一文件上传[FORM-DATA]</h2>
    <div class="upload-box">
      <input type="file" ref="input" accept=".png,.jepg,.jpg" @change="inputChange">
      <div class="btn-box">
        <button class="choose-btn" @click="choose">
          <span v-if="!loading">选择文件</span>
          <div class="loading" v-else>
            <img class="loading-icon" src="@/assets/loading.png" alt="">
            <span>上传中...</span>
          </div>
        </button>
        <button class="sumbit" @click="submit">
          <span v-if="!loading">上传到服务器</span>
          <div class="loading" v-else>
            <img class="loading-icon" src="@/assets/loading.png" alt="">
            <span>上传中...</span>
          </div>
        </button>
      </div>
      <p class="tips" v-if="!file">只能上传PNG/JPG/JPEG格式图片，且大小不能超过2MB</p>
      <div class="lists-box" v-else>
        <div class="list-item">
          <span class="file-name">{{ file.name }}</span>
          <span class="remove" @click="remove">移除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadSingle } from '@/api/index'
export default {
  name: 'SingleUpload',
  data () {
    return {
      loading: false,
      file: null
    }
  },
  methods: {
    choose () {
      if (this.loading) return
      this.$refs.input.click()
    },
    inputChange (e) {
      const file = e.target.files[0]
      if (!file) return
      this.file = file
    },
    async submit () {
      if (this.loading) return
      if (!this.file) return
      this.loading = true
      const fd = new FormData()
      fd.append('file', this.file)
      fd.append('filename', this.file.name)
      try {
        const result = await uploadSingle(fd)
        alert(`上传成功，通过${result.servicePath}访问`)
      } catch (error) {
        alert('上传失败，请重新上传！')
      } finally {
        this.finallyHandle()
      }
    },
    remove () {
      if (this.loading) return
      this.file = null
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
