function getCurDate() {
/**
 * 获取当前时间，格式：yyyy-mm-dd hh:mm:ss
 * @returns {timeCur} 当前时间，string
 */
    let cur = new Date()
    let year = cur.getFullYear()
    let month = cur.getMonth() + 1
    let day = cur.getDate()
    let hour = cur.getHours()
    let min = cur.getMinutes()
    let sec = cur.getSeconds()
    let timeCur = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
    return timeCur
}

module.exports = {
    getCurDate
}