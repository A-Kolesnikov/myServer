const mysql = require('mysql2');
const conf = require('../config/configData')

const connection = mysql.createConnection({
    ...conf.dbSettings
})

async function getCategories() {
    try {
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `SELECT * FROM categories`
            connection.query(sqlQuery, function (err, results, fields) {
                if (err) {
                    console.error('Error fetching category:', err)
                    reject(err)
                    return
                }
                resolve(results)
            })
        })
        return result
    } catch (error) {
        throw error
    }
}

async function getCategoryByID(id) {
    try {
        const result = await new Promise((resolve, reject) => {
            const sqlQuery = `SELECT * FROM categories WHERE id = ?`
            connection.query(sqlQuery, [id], function (err, results, fields) {
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

async function addCategory(newCategoryData) {
    const name = newCategoryData.name,
        parent_id = newCategoryData.parent_id,
        parentHierarchy = newCategoryData.parentHierarchy // may take hierarchy either from received data or from database
    try {
        const result = await new Promise((resolve, reject) => {
            let sqlQuery = `INSERT INTO categories (name, hierarchy)
                SELECT ?, (SELECT MAX(id) + 1 FROM categories)`
            let parameters = [name]
            if (parent_id) {
                sqlQuery = `INSERT INTO categories (name, parent_id, hierarchy)
                SELECT ?, ?, CONCAT (c.hierarchy, '-', (SELECT MAX(id) + 1 FROM categories))
                    FROM categories c WHERE c.id = ?;`
                parameters = [name, parent_id, parent_id]
            }
            connection.query(sqlQuery, parameters, function (err, results, fields) {
                if (err) {
                    console.error('Error adding category:', err)
                    reject(err)
                    return
                }
                resolve(results)
                /* format: ResultSetHeader {fieldCount: 0, affectedRows: 1, insertId: 34,
                    info: 'Records: 1  Duplicates: 0  Warnings: 0',
                    serverStatus: 2, warningStatus: 0, changedRows: 0
                }*/
            })
        })
        if (result.insertId)
        return getCategories() //result
    } catch (error) {
        throw error
    }
}

module.exports = {
    getCategories,
    getCategoryByID,
    addCategory
}