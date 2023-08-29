const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '4133',
    database: 'gps-store'
});

async function registerUser(email, password, name, telephone = null) {
    try {
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `SELECT * FROM users WHERE email = ?`
            connection.query(
                sqlQuery, [email], (err, results, fields)=>{
                    if (err) {
                        console.error('Error fetching user:', err)
                        reject(err)
                        return
                    }
                    resolve(results)
                });
        })
        if (result[0]){
            return null //{failure: "User already exists"}
        } else {
            const newUser = await new Promise((resolve, reject) => {
                const insertQuery = `INSERT INTO users (email, password, name, telephone) VALUES (?, ?, ?, ?)`
                connection.query(insertQuery, [email, password, name, telephone], (err, result) => {
                    if (err) {
                        console.error('Error inserting user:', err)
                        reject(err)
                        return
                    }
                    resolve({id: result.insertId, email: email, password: password, name: name, telephone: telephone, is_admin: null}) // generate user in same format, database returns
                });
            });
            return newUser;
        }
    } catch (erorr) {
        throw erorr
    }
}

module.exports = registerUser;