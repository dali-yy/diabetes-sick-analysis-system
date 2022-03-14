var fs = require('fs');
var child_process = require('child_process');
const sqlTools = require('./sqlTools');
const fileTools = require("./fileTools");
const { resolve } = require('path');

function saveJson(examData) {
/**
 * 将体检数据临时保存为temp.json文件，用于模型读取并分析
 * @param {examData} 体检数据，JSON
 */
    fs.writeFile('./src/DhCNNModel/temp.json', examData, (err) => {
        if (err) {
            console.log('JSON保存失败！')
            throw err
        }
        console.log('JSON保存成功！')
    })
}

function execQuery(formData) {
/**
 * 调用DhCNN模型完成糖尿病预测，并返回预测结果
 * @param {formData} 包含患者个人信息、症状描述和体检数据，JSON
 */
    let testCommand = ''
    let flag = 0
    if (formData['isExam'] == '是' && formData['isDesc'] == '是') {
        flag = 2
        testCommand = ['python ./src/DhCNNModel/test.py ',
                        formData['age'], ' ',
                        formData['sex'], ' ',
                        formData['desc'], ' ',
                        './src/DhCNNModel/temp.json'].join('')
    } else if (formData['isExam'] == '是') {
        flag = 1
        testCommand = ['python ./src/DhCNNModel/test.py ',
                        formData['age'], ' ',
                        formData['sex'], ' ',
                        '""', ' ',
                        './src/DhCNNModel/temp.json'].join('')
    } else {
        testCommand = ['python ./src/DhCNNModel/test.py ',
                        formData['age'], ' ',
                        formData['sex'], ' ',
                        formData['desc'], ' ',
                        '""'].join('')
    }
    console.log(testCommand)
    return new Promise(function(resolve, reject) {
        child_process.exec(testCommand, function(err, stdout, stderr){
            if (err) {
                reject("Read error: " + err.message)
            }else {
                // 导出判定结果到临时文件
                var data = fs.readFileSync('./src/DhCNNModel/probability.txt', 'utf8');
                prob = data.substring(2, 4) + '.' + data.substring(4, 6) + '%'
                console.log(prob)
                // 将本次判定记录到数据库
                if (!sqlTools.sqlInsert(formData, data, flag)) {
                    console.log('数据库存储失败！')
                    resolve('数据库存储失败！')
                }
                // 返回判定结果
                if (flag == 2) {
                    resolve('根据体检数据和症状描述分析，患者患糖尿病的概率为<strong><i>' + prob + '<i></strong>。')
                } else if (flag == 1) {
                    resolve('根据体检数据分析，患者患糖尿病的概率为<strong><i>' + prob + '<i></strong>。')
                } else {
                    resolve('根据症状描述分析，患者患糖尿病的概率为<strong><i>' + prob + '<i></strong>。')
                }
            }
        })
    })
}
    
async function analysis(formData, res){
/**
 * 解析execQuery函数调用模型进行分析的结果，并通过res将执行结果返回给前端
 * @param {formData} 包含患者个人信息、症状描述和体检数据，JSON
 * @param {res} 响应体对象，object
 */
    try {
        let n = await execQuery(formData);
        res.send(n);
    } catch(e) {
        console.log(e);
    }
    
}

function execQueryFile(filePath){
/**
 * 调用DhCNN模型分析文件中的数据，返回分析结果（患病概率分布、年龄分布、性别分布）
 * @param{filePath} 文件路径
 */
    let command = "python ./src/DhCNNModel/file_predict.py " + filePath
    return new Promise(function(resolve, reject){
        child_process.exec(command, function(err, stdout, stderr){
            if (err){
                reject("python error: " + err.message)
            }else{
                // 导出分析结果
                result = JSON.parse(fs.readFileSync("./src/DhCNNModel/result.json"));
                resolve(result);
            }
        })
    })
}

async function analysisFile(filePath, res){
/**
 * 解析execQueryFile函数调用模型进行分析的结果，并通过res将执行结果返回给前端
 * @param {filePath} 文件路径
 * @param {res} 响应体对象，object
 */
    try {
        let result = await execQueryFile(filePath);
        res.send(JSON.stringify({code: 200, data: result}));
    } catch(e) {
        console.log(e);
        res.send(JSON.stringify({code: 500, data: {}}));
    }
}

module.exports = {
    saveJson,
    analysis,
    analysisFile,
}