const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '4133',
    database: 'gps-store'
});

async function getUsers() {
    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM USERS',
                function (err, results, fields) {
                    if (err) {
                        console.error('Error fetching products:', err);
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
        })
        return results;
    } catch (erorr) {
        throw erorr
    }
}

module.exports = getUsers;