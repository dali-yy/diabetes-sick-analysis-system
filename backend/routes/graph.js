var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  res.sendFile(process.cwd() + '\\src\\graph\\map.html')
})

router.get('/getGraph', (req, res) => {
  res.sendFile(process.cwd() + '\\src\\graph\\graph.js')
})

router.get('/getConvertPinyin', (req, res) => {
    res.sendFile(process.cwd() + '\\src\\graph\\Convert_Pinyin.js')
})

router.get('/getCss', (req, res) => {
    res.sendFile(process.cwd() + '\\src\\graph\\style.css')
})

router.get('/getJson', (req, res) => {
    res.sendFile(process.cwd() + '\\src\\graph\\raw.json')
})

module.exports = router