const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '4133',
    database: 'gps-store'
});

async function setPasswordByEmail(email, newPassword) {
    try {
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `UPDATE users SET password = ? WHERE email = ?`
            connection.query(
                sqlQuery,
                [newPassword, email],
                function (err, results, fields) {
                    if (err) {
                        console.error('Error updating password:', err);
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
        });
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = setPasswordByEmail;