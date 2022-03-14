var express = require('express')
var router = express.Router()
const cnnTools = require('../src/Dao/cnnTools')
const skTools = require('../src/Dao/skTools')
const adTools = require('../src/Dao/adTools')
 
router.post('/saveExam', (req, res) => {
  let examData = JSON.stringify(req.body.exam)
  cnnTools.saveJson(examData)
  res.status(200).send('JSON saved complete.')
})

router.post('/analysis', (req, res) => {
  let formData = req.body
  cnnTools.analysis(formData, res)
  // res.send(result)
})

router.post('/analysisFile', (req, res) => {
  let filename = req.body.filename
  console.log("接收到的文件名是"+filename)
  cnnTools.analysisFile("upload/"+filename, res)
  // res.send(result)
})

router.post('/rmFilePredict', (req, res) => {
  let filename = req.body.filename;
  console.log("接收到的文件是：" + filename);
  skTools.rmAnalysis("upload/" + filename, res);
})

router.post('/rmSave', (req, res) => {
  let rmData = JSON.stringify(req.body)
  skTools.saveJson(rmData)
  res.status(200).send('JSON saved complete.')
})

router.post('/rmOnePredict', (req, res) => {
  let rmData = JSON.stringify(req.body)
  console.log("开始再入院预测...")
  skTools.rmAnalysisOne(rmData, res)
})

router.post('/anomalyDetection', (req, res) => {
  let filename = req.body.filename;
  console.log("接收到的文件是：" + filename);
  adTools.anomalyDetection("upload/" + filename, res).then((value) => {
    console.log(value);
    res.send(JSON.stringify({code: 200}));
  }).catch(error => {
    console.log(error);
    res.send(JSON.stringify({code: 500}));
  })
})

module.exports = router