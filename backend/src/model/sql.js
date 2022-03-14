var sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./src/sqlite3Tool/diabetes.db", function(err){
    if (err) throw err
})

module.exports = {
    db
}
