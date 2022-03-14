var fs = require('fs');
var child_process = require('child_process');
const sqlTools = require("./sqlTools");
const fileTools = require("./fileTools");

function predictFile(filePath){
    /**
     * 调用再入院预测模型预测
     * @param{filePath} 文件路径
     */
    let command = "python ./src/RMModel/rm_predict.py " + filePath;
    return new Promise(function(resolve, reject){
        child_process.exec(command, function(err, stdout, stderr){
            if (err){
                reject("python error: " + err.message);
            }else{
                // 导出分析结果
                resolve(stdout);
            }
        })
    })
}
    
async function rmAnalysis(filePath, res){
    /**
 * 再入院，并通过res将执行结果返回给前端
 * @param {filePath} 文件路径
 * @param {res} 响应体对象，object
 */
    try {
        let result = await predictFile(filePath);
        res.send(JSON.stringify({code: 200, data: result}));
    }catch(e){
        console.log(e);
        res.send(JSON.stringify({code: 500, data: {}}));
    }
}

function saveJson(rmData) {
    /**
     * 将再入院预测数据临时保存为temp.json文件，用于模型读取并分析
     * @param {rmData} 单条再入院数据，JSON
     */
    fs.writeFile('./src/RMModel/temp.json', rmData, (err) => {
        if (err) {
            console.log('JSON保存失败！')
            throw err
        }
        console.log('JSON保存成功！')
        
    })
}

function rmPredict(formData) {
    let command = "python ./src/RMModel/one_predict.py ./src/RMModel/temp.json"
    // 表单数据保存到json文件后进行预测
    return new Promise(function(resolve, reject){
        child_process.exec(command, function(err, stdout, stderr){
            if (err){
                reject("python error: " + err.message);
            }else{
                // 再入院预测记录
                proba = parseFloat(stdout).toFixed(4);
                // 将再入院预测记录存储到数据库
                if(sqlTools.rmSqlInsert(formData, proba)){
                    console.log("再入院预测记录存储成功！");
                }else{
                    console.log("再入院预测记录存储失败！请重试！");
                }
                // 导出分析结果
                resolve((proba*100) + "%");
            }
        })
    })
}
    
async function rmAnalysisOne(formData, res){
    /**
 * 再入院预测一条记录，并通过res将执行结果返回给前端
 * @param {filePath} 文件路径
 * @param {res} 响应体对象，object
 */
    try {
        let result = await rmPredict(formData);
        res.send(result);
    } catch(e) {
        console.log(e);
    }
    
}
module.exports = {
    rmAnalysis,
    saveJson,
    rmAnalysisOne
}