const express = require('express')
const app = express()
// 导入依赖包(将请求参数转化为json)
const parser = require('body-parser')
app.use(parser.json())
// app.use(express.urlencoded({ extended: false }));
 
const vipLogin = {
    code: 200,
    msg: 'success',
    data: []
}
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})
app.get('/login', (req, res) => {
    console.log(req.query, '<-- req')
    res.send(vipLogin)
})

app.post('/ownInfo', (req, res) => {
    console.log(req, '<--- post - req')
    console.log(req)
    res.send({ code: 200, msg: 'success', data: [{ name: 'namei' }], rP: req.body })
})

app.listen(3300, () => { 
    console.log('服务器运行在3300')
})