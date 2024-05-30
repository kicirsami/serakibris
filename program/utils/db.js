const mysql = require("mysql");
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'sera'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL bağlantısı başarısız: ' + err.stack);
        return;
    }
    console.log('MySQL bağlantısı başarıyla gerçekleştirildi. Bağlantı ID: ' + db.threadId);
});

module.exports = db