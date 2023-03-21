<template>
  <div class="single-upload upload-box">
    <h2>单一文件上传[FORM-DATA]</h2>
    <div class="upload-box">
      <input type="file" ref="input" multiple @change="inputChange">
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
      <p class="tips" v-if="!file.length">多文件上传</p>
      <div class="lists-box" v-else>
        <div class="list-item" v-for="item in file" :key="item.key">
          <span class="file-name">{{ item.file.name }}</span>
          <span class="remove" @click="remove(item.key)" v-if="item.percent === '0%'">移除</span>
          <span class="remove" v-else>{{ item.percent }}</span>
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
      file: []
    }
  },
  methods: {
    choose () {
      if (this.loading) return
      this.$refs.input.click()
    },
    inputChange (e) {
      const _files = [...e.target.files]
      const temp = []
      if (!_files.length) return
      // 筛选出不重复的
      _files.forEach(_file => {
        if (!this.file.some(item => item.file.name === _file.name)) {
          temp.push(_file)
        }
      })
      // 暂时存储
      const _file = [
        ...this.file
      ]
      temp.forEach(item => {
        _file.push({
          key: this._createRandom(),
          percent: '0%',
          file: item
        })
      })
      // 取后面四个
      this.file = _file.slice(-4)
    },
    async submit () {
      if (this.loading) return
      if (!this.file.length) return
      this.loading = true
      const requestArr = this.file.map(f => {
        const fd = new FormData()
        fd.append('file', f.file)
        fd.append('filename', f.file.name)
        return uploadPecentSingle(fd, f)
      })
      try {
        await Promise.all(requestArr)
        alert('上传成功！')
      } catch (error) {
        alert('上传出错，请重新上传！')
      } finally {
        this.loading = false
        this.file = []
      }
    },
    remove (key) {
      if (this.loading) return
      this.file = this.file.filter(item => item.key !== key)
    },
    finallyHandle () {
      this.loading = false
      this.file = null
    },
    _createRandom () {
      const ran = Math.random() * new Date()
      return ran.toString(16).replace('.', '')
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
