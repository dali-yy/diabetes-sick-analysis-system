var express = require('express')
var router = express.Router()

router.get('/getFig', (req, res) => {
    let img = req.query.img
    res.sendFile(process.cwd() + '\\src\\ADModel\\' + img)    
})

module.exports = router