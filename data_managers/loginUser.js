const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '4133',
    database: 'gps-store'
});

async function loginUser(email, password) {
    try {
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `SELECT * FROM users WHERE email = ?`;
            connection.query(
                sqlQuery, [email], (err, results, fields)=>{
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

module.exports = loginUser;