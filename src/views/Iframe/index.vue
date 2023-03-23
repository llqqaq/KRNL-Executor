<template>
  <div class="iframe">
    <p>通过postMessage去实现父子之间通讯，需要子界面能操控(能写代码)</p>
    <iframe ref="iframe" src="http://127.0.0.1:5500/test.html" frameborder="0"></iframe>
    <div class="insert-box">
      <p v-for="(item, index) in txtArr" :key="index">
        <span>{{ item }}</span>
        <button @click="insert(item)">插入</button>
      </p>
    </div>
    <p class="parent-content">父级内容</p>
    <iframe src="/iframeB" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'IFrame',
  data () {
    return {
      txtArr: ['你好', '我好', '才是大家好']
    }
  },
  mounted () {
    // 监听
    window.addEventListener('message', event => {
      if (event.data === 'fromChild') {
        console.log('父组件', event.data)
      }
    })
  },
  methods: {
    insert (value) {
      const iframeWin = this.$refs.iframe.contentWindow
      iframeWin.postMessage({
        type: 'txt',
        value: value
      }, '*')
    }
  }
}
</script>

<style lang='scss' scoped>
.iframe {
  width: 400px;
  height: 700px;
  margin: 0 auto;
  margin-top: 100px;
  iframe {
    width: 100%;
    height: 400px;
    border: 1px solid #d7bebe;
  }
  .insert-box {
    text-align: center;
    p {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      span {
        margin-bottom: 10px;
      }
      button {
        width: 100px;
        cursor: pointer;
      }
    }
  }
}
</style>
