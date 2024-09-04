const db = require('../db');

// values 可以是对象，可以是字符串
function query(sql, values, response) {
    let res = response;
    if (response === undefined) {
        res = values; // 如果只传了两个参数，那么第二个参数 values 其实是 res
        values = undefined; // 由于 response 被占用了，需要清空 values
    }
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, rows) => {
            if (err) {
                if (res && typeof res.status === 'function') {
                    res.status(500).json({ error: err.message });
                }
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function queryT(sql, values, response) {
    let res = response;
    if (response === undefined) {
        res = values; // 如果只传了两个参数，那么第二个参数 values 其实是 res
        values = undefined; // 由于 response 被占用了，需要清空 values
    }
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, rows) => {
            if (err) {
                db.rollback(() => {
                    if (res && typeof res.status === 'function') {
                        res.status(500).json({ error: err.message });
                    }
                });
                return reject(err);
            }
            resolve(rows);
        });
    });
}

exports.query = query;
exports.queryT = queryT;
