<template>
  <div>
    <input type="file" @input="inputVal">
    <button @click="submit">上传{{ percent }}</button>
    <p>通过fileReader做文件的缩略图</p>
    <img class="img" :src="base64Img" alt="">
    <input type="file" @input="showImg">
  </div>
</template>

<script>
/**
 * files: 通过input标签读过来的文件对象,所上传的内容通过[0],[1]获取，类数组集合
 * blob: 不可变的二进制内容，包含了很多操作方法，slice切割
 * formData: 用于和后端传输的对象
 * fileReader: 将文件读取成某种形式，如base64， text文本
 * -------------------------------------------------------------
 *          互相转换
 * flies <---------->  blobs
 * 上面两者都可以转换为 FileReader
 * FileReader转成 base64/text 与后台交互
 * -------------------------------------------------------------
 * flies,blobs都可以通过 formData实例的append，与后台交互
 * formData是files与blobs与后台交互的载体
 */
/**
 * 思考：
 *      为什么要使用大文件切片上传？
 *      这里的为什么不需要通知后端，上传完毕了
 */
import axios from 'axios'
let _file = null // 文件对象
export default {
  name: 'LargeFileSplice',
  data () {
    return {
      base64Img: '',
      percent: '0%'
    }
  },
  methods: {
    inputVal (e) {
      console.log(e.target.files)
      const file = e.target.files[0] // file 不仅是File对象，而且也是Blob对象，因为File本身就是Blob的子类， File可以跟Blob相互转换
      _file = file
      console.dir(file)
      // file对象切割完后变成blob对象
      const sliceAfter = file.slice(0, 2200)
      console.dir(sliceAfter)
      // 转成Blob对象，第二个参数是文件名
      const transBlod = new File([sliceAfter], 'a.txt')
      console.dir(transBlod)
    },
    async submit () {
      if (!_file) return
      const size = _file.size
      const cutSize = 2 * 1024 * 1024
      // 从本地获取是否存在断电记录
      const localCurrent = localStorage.getItem(_file.name)
      let current = localCurrent || 0
      while (current < size) {
        try {
          const fd = new FormData()
          fd.append(_file.name, _file.slice(current, current + cutSize))
          await axios.post('http://localhost:3300/ownInfo', fd)
          current += cutSize
          this.percent = `${Math.min((current / size * 100).toFixed(2), 100)}%`
          console.log(current)
        } catch (error) {
          // 报错保存当前的current,断点续传
          localStorage.setItem(_file.name, current)
          throw new Error(error)
        }
      }
      // 传递完成
      localStorage.clear(_file.name)
      // 通知后端本次文件上传完毕
    },
    showImg (e) {
      const that = this
      const file = e.target.files[0]
      // that.base64Img = URL.createObjectURL(file) // 直接通过URL.createObjectURL将file对象转成url地址
      const fr = new FileReader() // 或者通过fileReader做缩略图
      fr.readAsDataURL(file) // 转成base64,异步过程
      fr.onload = function () {
        const result = fr.result
        that.base64Img = result
      }
    }
  }
}
</script>

<style lang='scss' scoped>
div {
    padding-top: 20px;
}
input {
    margin-bottom: 50px;
}
.img {
    width: 300px;
    display: block;
    margin: 0 auto;
}
</style>
