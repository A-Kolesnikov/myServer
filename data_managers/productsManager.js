const mysql = require('mysql2')
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
                        console.error('Error fetching products:', err)
                        reject(err)
                        return
                    }
                    resolve(results)
                })
        })
        return result[0]
    } catch (erorr) {
        throw erorr
    }
}

async function getProducts() {
    try {
        const sqlQuery = `SELECT * FROM PRODUCTS`
        const results = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
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

async function getProductsOfCategory(categoriesID) {
    try {
        const queryCategories = categoriesID //format 1,2,5
        const sqlQuery = `SELECT * FROM PRODUCTS WHERE category_id IN (${queryCategories})`
        const results = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                //[queryCategories],
                function (err, results, fields) {
                    if (err) {
                        console.error('Error fetching products:', err)
                        reject(err)
                        return
                    }
                    resolve(results);
                });
        })
        return results;
    } catch (erorr) {
        throw erorr
    }
}

async function getProductsWithIDs(IDs) {
    try {
        const setOfIDs = IDs //format 1,2,5
        const sqlQuery = `SELECT * FROM PRODUCTS WHERE id IN (${setOfIDs})`
        const results = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                function (err, results, fields) {
                    if (err) {
                        console.error('Error fetching products:', err)
                        reject(err)
                        return
                    }
                    resolve(results);
                });
        })
        return results;
    } catch (erorr) {
        throw erorr
    }
}

async function decreaseInStock(id, quanity){
    try{
        const sqlQuery = 
        `UPDATE products
        SET units_in_stock = CASE
            WHEN units_in_stock >= ? THEN units_in_stock - ?
            ELSE units_in_stock
        END
        WHERE id = ?`
        const result = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                [quanity, quanity, id],
                function (err, results, fields) {
                    if (err) {
                        console.error('Error fetching products:', err)
                        reject(err)
                        return
                    }
                    resolve(results)
                })
        })
        return result
    } catch (erorr) {
        throw erorr
    }
}

module.exports = {
    getProduct,
    getProducts,
    getProductsWithIDs,
    getProductsOfCategory,
    decreaseInStock
}