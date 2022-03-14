const csv = require("csvtojson");   // 引入csv格式转json格式的包
const sqlTools = require('./sqlTools');  // 引入操作数据库的工具


/**
 * 将患病风险预测后的结果文件写入数据库
 * @param {*} filePath 文件路径
 */
function fileToSql(filePath) {
    // 将csv文件转换成json对象并处理
    const converter = csv()
        .fromFile(filePath)  // 需要转换的csv文件
        .then((json) => {
            // 对每个json对象进行处理
            json.forEach(function(item){
                // 转换成数据库插入函数接收的样式
                formData = {};
                formData.name = item['姓名'];
                formData.sex = (item['性别'] == 1) ? '男' : '女';
                formData.age = parseInt(item['年龄']);
                formData.desc = item['content'];
                formData.exam = {
                    thxhdb: parseFloat(item['糖化血红蛋白']),
                    gaxztm: parseFloat(item['γ-谷氨酰转肽酶']),
                    rstqm: parseFloat(item['乳酸脱氢酶']),
                    dmdzdb: parseFloat(item['低密度脂蛋白']),
                    qbdb: parseFloat(item['前白蛋白']),
                    ns1: parseFloat(item['尿素']),
                    ns2: parseFloat(item['尿酸']),
                    zdgc: parseFloat(item['总胆固醇']),
                    zdzs: parseFloat(item['总胆汁酸']),
                    zdhs: parseFloat(item['总胆红素']),
                    zdb: parseFloat(item['总蛋白']),
                    qdb: parseFloat(item['球蛋白']),
                    gysz: parseFloat(item['甘油三脂']),
                    bqb: parseFloat(item['白球比']),
                    bdb: parseFloat(item['白蛋白']),
                    zjdhs: parseFloat(item['直接胆红素']),
                    jxlsm: parseFloat(item['碱性磷酸酶']),
                    jg: parseFloat(item['肌酐']),
                    jsjm: parseFloat(item['肌酸激酶']),
                    djzm: parseFloat(item['胆碱脂酶']),
                    zdba: parseFloat(item['脂蛋白(a)']),
                    ptt: parseFloat(item['葡萄糖']),
                    zzdba1: parseFloat(item['载脂蛋白A1']),
                    zzdbb: parseFloat(item['载脂蛋白B']),
                    jjdhs: parseFloat(item['间接胆红素']),
                    gmdzdb: parseFloat(item['高密度脂蛋白'])
                  };
                formData.isDesc = (item['content'] == "") ? '否' : '是';
                formData.isExam = '是';

                proba = item['proba']  // 患病概率

                // 将数据插入数据库
                sqlTools.sqlInsert(formData, proba, 1);
            })
        })
}

/**
 * 将再入院风险预测后的结果文件写入数据库
 * @param {*} filePath 文件路径
 */
 function rmFileToSql(filePath) {
     // 转换成数据库插入函数接收的样式
     let features = [
         "race",
         "sex",
         "age",
         "admissionType",
         "discharge",
         "admissionSource",
         "timeHospital",
         "numLab",
         "numProcedures",
         "numMedications",
         "numOutpatient",
         "numEmergency",
         "numInpatient",
         "numDiagnoses",
         "maxGluSerum",
         "a1Result",
         "metformin",
         "repaglinide",
         'nateglinide',	
         "chlorpropamide",	
         "glimepiride",
         "acetohexamide",	
         "glipizide",	
         "glyburide",	
         "tolbutamide",	
         "pioglitazone",	
         "rosiglitazone",	
         "acarbose",	
         "miglitol",	
         "troglitazone",	
         "tolazamide",	
         "examide",	
         "citoglipton",	
         "insulin",
         "glyburideMetformin",	
         "glipizideMetformin",	
         "glimepiridePioglitazone",	
         "metforminRosiglitazone",	
         "metforminPioglitazone",
         "change",
         "diabetesMed"
     ]
    // 将csv文件转换成json对象并处理
    const converter = csv()
        .fromFile(filePath)  // 需要转换的csv文件
        .then((json) => {
            // 对每个json对象进行处理
            json.forEach(function(item){
                // 转换成数据库识别的格式
                record = {};
                for (let i=0; i < features.length; i++) {
                    record[features[i]] = item[Object.keys(item)[i]]
                }
                // 将数据插入数据库
                sqlTools.rmSqlInsert(JSON.stringify(record), parseFloat(item.proba).toFixed(4));
            })
        })
}
module.exports = {
    fileToSql,
    rmFileToSql
}
