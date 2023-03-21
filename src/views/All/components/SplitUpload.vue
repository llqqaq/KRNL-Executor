<template>
  <div class="single-upload upload-box">
    <h2>切片上传[FORM-DATA]</h2>
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
      <p class="tips" v-if="!file">只能上传PNG/JPG/JPEG格式图片，且大小不能超过2MB</p>
      <div class="lists-box" v-else>
        <div class="list-item">
          <span class="file-name">{{ file.name }}</span>
          <span class="remove" @click="remove">移除</span>
        </div>
      </div>
      <div class="percent" v-if="loading">
        <span :style="{ width: percent}"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadAlready, uploadChunk, uploadMerge } from '@/api/index'
import { changeBuffer } from '@/utils/hash'
let CHUNK_SIZE = 2 * 1024 * 1024 // 切片的大小
export default {
  name: 'SingleUpload',
  data () {
    return {
      loading: false,
      file: null,
      percent: '0%',
      hash: '', // 文件的hash值
      totalCount: 0, // 需要切的总数
      chunkUploadCount: 0, // 已经上传的数量
      alreadyList: [], // 已经切片的list
      catList: [] // 切片数组
    }
  },
  methods: {
    choose () {
      if (this.loading) return
      this.$refs.input.click()
    },
    inputChange (e) {
      const file = e.target.files[0]
      console.log(e.target.value)
      console.log(file)
      if (!file) return
      this.file = file
    },
    async submit () {
      if (this.loading) return
      if (!this.file) return
      this.loading = true
      // 获取hash值
      const { hash, suffix } = await changeBuffer(this.file)
      this.hash = hash
      // 获取已经上传的切片数组
      const { fileList: alreadyList } = await uploadAlready({
        HASH: hash
      })
      console.log('alreadyList', alreadyList)
      this.alreadyList = alreadyList
      // 对file进行切片
      this.splitChunk(this.file, hash, suffix)
      // 开始上传
      this.upload()
    },
    splitChunk (file, hash, suffix) {
      let count = 0
      this.totalCount = Math.ceil(file.size / CHUNK_SIZE)
      // 如果次数大于100，那就增大每次上传的size
      if (this.totalCount > 100) {
        CHUNK_SIZE = file.size / 100
        this.totalCount = 100
      }
      while (count < this.totalCount) {
        const _file = file.slice(count * CHUNK_SIZE, (count + 1) * CHUNK_SIZE)
        this.catList.push({
          file: _file,
          filename: `${hash}_${count + 1}.${suffix}`
        })
        count++
      }
    },
    upload () {
      this.catList.forEach(_f => {
        // 如果已经上传，则直接返回
        if (this.alreadyList.some(filename => filename === _f.filename)) {
          return this.addCount()
        }
        // 未上传的切片
        const fd = new FormData()
        fd.append('file', _f.file)
        fd.append('filename', _f.filename)
        uploadChunk(fd)
          .then(res => {
            this.addCount()
          })
          .catch(e => {
            console.log('切片上传出错,请重新上传')
            this.reset()
          })
      })
    },
    reset () {
      this.percent = '0%'
      this.loading = false
      this.file = null
      this.hash = ''
      this.totalCount = 0
      this.chunkUploadCount = 0
      this.alreadyList = []
      this.catList = []
      this.$refs.input.value = null // 要清空，不然选择重新选择上一个文件不会触发change事件
    },
    async addCount () {
      this.chunkUploadCount++
      this.percent = `${(this.chunkUploadCount / this.totalCount) * 100}%`
      if (this.chunkUploadCount < this.totalCount) return
      // 上传完毕
      // 通知切片
      await uploadMerge({
        HASH: this.hash,
        count: this.totalCount
      })
      alert('上传成功~')
      this.reset()
    },
    remove () {
      if (this.loading) return
      this.file = null
      this.$refs.input.value = null
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
  margin-top: 20px;
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
