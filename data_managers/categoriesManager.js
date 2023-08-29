const mysql = require('mysql2');
const conf = require('../config/configData')

const connection = mysql.createConnection({
    host: conf.dbSettings.host,
    port: conf.dbSettings.port,
    user: conf.dbSettings.user,
    password: conf.dbSettings.password,
    database: conf.dbSettings.database
});

async function getCategoryByID(id) {
    try {
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `SELECT * FROM categories WHERE id = ?`
            connection.query(sqlQuery, [id], function(err, results, fields) {
                if (err) {
                    console.error('Error fetching category:', err)
                    reject(err)
                    return
                }
                resolve(results)
            })
        })
        return result[0]
    } catch (error) {
        throw error
    }
}

async function addCategory(categoryName, parent_id = null) {
    try {
        //if (!parent_id){
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `INSERT INTO categories (name, herarchy) SELECT ?, LAST_INSERT_ID()+1 FROM categories c`
            connection.query(sqlQuery, [categoryName], function(err, results, fields) {
                if (err) {
                    console.error('Error fetching category:', err)
                    reject(err)
                    return
                }
                resolve(results)
            })
        })
        //}
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    getCategoryByID
}