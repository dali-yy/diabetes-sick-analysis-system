const timeTools = require('../utils/timeTools');
const sqlModel = require('../model/sql')
let db = sqlModel.db

function sqlInsert(formData, data, flag) {
/**
 * 将用户输入的所有数据保存到数据库中
 * @param {formData} 包含患者个人信息、症状描述和体检数据，JSON
 * @param {data} 患者患病概率，float
 * @param {flag} 是否输入体检数据，boolean
 * @returns {isSuccess} 是否插入成功的标志，boolean
 */
    let isSuccess = true
    let timeCur = timeTools.getCurDate()
    let sql = "INSERT INTO `history`(`name`, `time`, `desc`, `isDesc`, `isExam`, `prob`) VALUES (?, ?, ?, ?, ?, ?);"
    let obj = [
        formData['name'],
        timeCur, 
        formData['desc'], 
        formData['isDesc'] == '是' ? 1 : 0, 
        formData['isExam'] == '是' ? 1 : 0, 
        parseFloat(data)
    ]
    db.run(sql, obj, (err) => {
        if (err) {
            isSuccess = false
            console.log(err)
            console.log('判定记录存储失败！请重试！')
        } else {
            console.log('判定记录存储成功！')
        }
    })
    if (flag) {
        // 获取history表最后一次插入的记录id
        db.get("SELECT MAX(rowid) FROM history;", (err, row) => {
            hid = row['MAX(rowid)'] // 获取最后一次插入history表的id
            sql = "INSERT INTO `exam`(`hid`, `name`, `time`, `age`, `sex`, \
            `thxhdb`, `gaxztm`, `rstqm`, `dmdzdb`, `qbdb`, `ns1`, `ns2`, `zdgc`, `zdzs`, `zdhs`, `zdb`, `qdb`, `gysz`, `bqb`, `bdb`, `zjdhs`, `jxlsm`, `jg`, `jsjm`, `djzm`, `zdba`, `ptt`, `zzdba1`, `zzdbb`, `jjdhs`, `gmdzdb`, `gmdzdb`) \
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
            obj = [hid,
                formData['name'], 
                timeCur,  
                formData['age'],
                formData['sex']].concat(Object.values(formData['exam']))
            db.run(sql, obj, (err) => {
                if (err) {
                    flag = false
                    console.log(err)
                    console.log('体检信息存储失败！请重试！')
                } else {
                    console.log('体检信息存储成功！')
                }
            })
        })
        
    }
    return isSuccess
}

function sqlDelete(examID, isExam) {
/**
 * 删除指定日期的历史记录和体检数据
 * @param {examDate} 体检日期，string
 * @param {isExam} 是否输入了体检数据，string
 * @returns {isSuccess} 是否删除成功的标志，boolean
 */
    let isSuccess = true
    let sql = 'delete from history where id = "' + examID + '";'
    console.log(sql)
    db.run(sql, (err) => {
        if (err) {
            isSuccess = false
            console.log(err)
            console.log('删除历史记录失败')
        } else {
            console.log('删除历史记录成功！')
        }
    })
    if (isExam == '是') {
        sql = 'delete from exam where hid = "' + examID + '";'
        console.log(sql)
        db.run(sql, (err) => {
            if (err) {
                isSuccess = false
                console.log(err)
                console.log('删除体检记录失败')
            } else {
                console.log('删除体检记录成功！')
            }
        })
    }
    return isSuccess
}

function sqlRun(sql) {
/**
 * 执行sql语句
 * @param {sql} 将要执行的sql语句，string
 */
    return new Promise(function(resolve, reject) {
        db.all(sql, [], function(err, rows)  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(rows)
            }
        })
    })
}

async function sqlGetAll(sql, res){
/**
 * 解析sqlRun函数执行sql语句的结果，并通过res将执行结果返回给前端
 * @param {sql} 将要执行的sql语句，string
 * @param {res} 响应体对象，object
 */
    let n = await sqlRun(sql)
    res.send(n)
}

function rmSqlInsert(formData, proba) {
    /**
     * 将用户输入的再入院信息保存到数据库
     * @param {formData} 再入院信息，JSON
     * @param {proba} 患者再入院概率，float
     */
     let isSuccess = true;  // 是否插入成功的标志
     let sql = "INSERT INTO `readmission` (`race`, `sex`, `age`, `admissionType`, `discharge`, `admissionSource`, `timeHospital`, `numLab`, `numProcedures`, `numMedications`, `numOutpatient`, `numEmergency`, `numInpatient`, `numDiagnoses`, `maxGluSerum`, `a1Result`, `metformin`, `repaglinide`, `nateglinide`, `chlorpropamide`,	`glimepiride`, `acetohexamide`,	`glipizide`, `glyburide`, `tolbutamide`, `pioglitazone`, `rosiglitazone`, `acarbose`, `miglitol`, `troglitazone`, `tolazamide`, `examide`, `citoglipton`, `insulin`, `glyburideMetformin`, `glipizideMetformin`, `glimepiridePioglitazone`, `metforminRosiglitazone`, `metforminPioglitazone`, `change`, `diabetesMed`, `proba`)\
     VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    // 提取表单中的值
    record = Object.values(JSON.parse(formData))
    // 加入预测概率
    record.push(proba)
    db.run(sql, record, (err) => {
        if (err) {
            isSuccess = false;
            console.log(err);
            console.log('再入院预测记录存储失败！请重试！');
        } else {
            console.log('再入院记录存储成功！');
        }
    })

    // 返回插入是否成功的标志
    return isSuccess;
}

function rmSqlDelete(rmID) {
    /**
     * 删除再入院预测记录
     * @param{rmID} 再入院预测记录ID
     */
    let isSuccess = true;  // 是否插入成功的标志
    // sql语句
    sql = "DELETE FROM `readmission` where `id` = " + rmID + ";";
    db.run(sql, (err) => {
        if(err){
            isSuccess = false;
            console.log(err);
            console.log("再入院预测记录删除失败！");
        }else{
            console.log("再入院预测记录删除成功！");
        }
    })
    return isSuccess;
}

module.exports = {
    sqlInsert,
    sqlDelete,
    sqlGetAll,
    rmSqlInsert,
    rmSqlDelete
}