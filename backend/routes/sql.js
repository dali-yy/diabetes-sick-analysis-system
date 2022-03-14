var express = require('express')
var router = express.Router()
const sqlTools = require('../src/Dao/sqlTools')
const fileTools = require('../src/Dao/fileTools')

router.post('/getList', (req, res) => {
    let sql = 'select * from history;'
    sqlTools.sqlGetAll(sql, res)
    // res.send(list)
})

router.post('/getExam', (req, res) => {
    let hid = req.body.id
    let sql = 'select * from exam where hid = "' + hid + '";'
    sqlTools.sqlGetAll(sql, res)
    // res.send(list)
})

router.post('/deleteHis', (req, res) => {
    let examID = req.body.id
    let isExam = req.body.isExam
    if (sqlTools.sqlDelete(examID, isExam)) {
        res.send({
            'msg': '记录删除完成！',
            'code': 200
        })
    } else {
        res.send({
            'msg': '记录删除失败！',
            'code': 500
        })
    }
})

router.post('/rmGetList', (req, res) => {
    let sql = 'select * from readmission;'
    sqlTools.sqlGetAll(sql, res)
    // res.send(list)
})

router.post('/rmDelete', (req, res) => {
    let rmID = req.body.id;
    if (sqlTools.rmSqlDelete(rmID)) {
        res.send({
            'msg': '记录删除完成！',
            'code': 200
        })
    } else {
        res.send({
            'msg': '记录删除失败！',
            'code': 500
        })
    }
})

router.post("/sickFileToSql", (req, res) => {
    let filePath = req.body.filename;
    fileTools.fileToSql("./result/" + filePath.slice(0, -4) + "_pred.csv");
    res.send({
        'msg': '保存成功!'
    });
})

router.post("/rmFileToSql", (req, res) => {
    let filePath = req.body.filename;
    fileTools.rmFileToSql("./result/" + filePath.slice(0, -4) + "_pred.csv");
    res.send({
        'msg': '保存成功!'
    });
})


module.exports = router