const mysql = require('mysql2')
const conf = require('../config/configData')

const connection = mysql.createConnection({
    ...conf.dbSettings
})

async function getUser(id) {
    try {
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `SELECT * FROM users WHERE id = ?`
            connection.query(sqlQuery, [id],
                function (err, results, fields) {
                    if (err) {
                        console.error('Error fetching user:', err)
                        reject(err)
                        return;
                    }
                    resolve(results)
                })
        })
        return result
    } catch (erorr) {
        throw erorr
    }
}

async function getUsers() {
    try {
        const results = await new Promise((resolve, reject) => {
            const sqlQuery = 'SELECT * FROM USERS'
            connection.query(sqlQuery,
                function (err, results, fields) {
                    if (err) {
                        console.error('Error fetching products:', err)
                        reject(err)
                        return
                    }
                    resolve(results)
                })
        })
        return results
    } catch (erorr) {
        throw erorr
    }
}

async function getUserByEmail(email) {
    try {
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `SELECT * FROM users WHERE email = ?`
            connection.query(sqlQuery, [email],
                function (err, results, fields) {
                    if (err) {
                        console.error('Error fetching user:', err)
                        reject(err)
                        return;
                    }
                    resolve(results)
                })
        })
        return result[0]
    } catch (erorr) {
        throw erorr
    }
}

async function registerUser(email, password, name, telephone = null) {

    try {
        if (await getUserByEmail(email)) {
            return null //{failure: "User already exists"}
        } else {
            const newUser = await new Promise((resolve, reject) => {
                const insertQuery = `INSERT INTO users (email, password, name, telephone) VALUES (?, ?, ?, ?)`
                connection.query(insertQuery, [email, password, name, telephone],
                    function (err, result) {
                    if (err) {
                        console.error('Error inserting user:', err)
                        reject(err)
                        return
                    }
                    resolve({ id: result.insertId, email: email, password: password, name: name, telephone: telephone, is_admin: null }) // generate user in same format, database returns
                });
            });
            return newUser;
        }
    } catch (erorr) {
        throw erorr
    }
}

async function setPasswordByEmail(email, newPassword) {
    try {
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `UPDATE users SET password = ? WHERE email = ?`
            connection.query(sqlQuery, [newPassword, email],
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

module.exports = {
    getUser,
    getUsers,
    getUserByEmail,
    registerUser,
    setPasswordByEmail
}