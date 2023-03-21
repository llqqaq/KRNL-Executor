<template>
  <div class="single-upload upload-box">
    <h2>多文件上传,显示进度条[FORM-DATA]</h2>
    <div class="upload-box">
      <input type="file" ref="input" @change="inputChange">
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
      <div class="percent">
        <span :style="{ width: percent}"></span>
      </div>
      <div class="lists-box" v-if='file'>
        <div class="list-item">
          <span class="file-name">{{ file.name }}</span>
          <span class="remove" @click="remove">移除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadPecentSingle } from '@/api/index'
export default {
  name: 'SingleUpload',
  data () {
    return {
      loading: false,
      file: null,
      percent: '0%'
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
    async delayFn (time = 500) {
      return new Promise(resolve => {
        setTimeout(() => { resolve() }, time)
      })
    },
    async submit () {
      if (this.loading) return
      if (!this.file) return
      this.loading = true
      const fd = new FormData()
      fd.append('file', this.file)
      fd.append('filename', this.file.name)
      try {
        const result = await uploadPecentSingle(fd, this)
        await this.delayFn()
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
      this.percent = '0%'
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
    .percent {
      width: 98.5%;
      margin: 0 auto;
      height: 10px;
      background-color: #ECECEC;
      border-radius: 5px;
      overflow: hidden;
      span {
        display: block;
        height: 100%;
        background-color: #8EC674;
      }
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
