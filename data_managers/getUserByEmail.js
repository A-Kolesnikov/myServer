const mysql = require('mysql2');
const conf = require('../config/configData')

const connection = mysql.createConnection({
    host: conf.dbSettings.host,
    port: conf.dbSettings.port,
    user: conf.dbSettings.user,
    password: conf.dbSettings.password,
    database: conf.dbSettings.database
});

async function getUserByEmail(email) {
    try {
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `SELECT * FROM users WHERE email = ?`
            connection.query(sqlQuery, [email], function (err, results, fields) {
                    if (err) {
                        console.error('Error fetching user:', err);
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
        })
        return result[0];
    } catch (erorr) {
        throw erorr
    }
}

module.exports = getUserByEmail;