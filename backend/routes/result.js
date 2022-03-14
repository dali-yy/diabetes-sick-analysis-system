var express = require('express')
var router = express.Router()
var fs = require('fs')
const fileTools = require('../src/Dao/fileTools')


router.get('/getResult', (req, res) => {
    let result = {}
    type = req.query.type;
    if (type === "sick") {
        result = fs.readFileSync("./src/DhCNNModel/result.json");
    } else if(type === "readmission"){
        result = fs.readFileSync("./src/RMModel/result.json");
    }
    res.send(result)
})

module.exports = router