var fs = require('fs');
var child_process = require('child_process');

function anomalyDetection(filePath){
    /**
     * 调用再入院预测模型预测
     * @param{filePath} 文件路径
     */
    let command = "python ./src/ADModel/auto_test.py " + filePath
    return new Promise(function(resolve, reject){
        child_process.exec(command, function(err, stdout, stderr){
            if (err){
                reject("python error: " + err.message)
            }else{
                // 导出分析结果
                resolve("异常检测成功！");
            }
        })
    })
}
    
module.exports = {
    anomalyDetection
}