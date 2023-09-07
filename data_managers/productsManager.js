const mysql = require('mysql2');
const conf = require('../config/configData')

const connection = mysql.createConnection({
    ...conf.dbSettings
})

async function getProduct(id) {
    try {
        const sqlQuery = `SELECT * FROM products WHERE id = ?`
        const result = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                [id],
                function (err, results, fields) {
                    if (err) {
                        console.error('Error fetching products:', err);
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

async function getProducts() {
    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM PRODUCTS',
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

module.exports = {
    getProduct,
    getProducts
}