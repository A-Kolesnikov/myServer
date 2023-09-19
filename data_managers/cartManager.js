const mysql = require('mysql2')
const conf = require('../config/configData')

const connection = mysql.createConnection({
    ...conf.dbSettings
})

async function getCartOfUser(user_id) {
    try {
        const sqlQuery = `SELECT * FROM cart_items WHERE user_id = ?`
        const result = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                [user_id],
                function (err, results) {
                    if (err) {
                        console.error(`error fetching cart:`, err)
                        reject(err)
                        return
                    }
                    resolve(results)
                }
            )
        })
        return result
    } catch (error) {
        throw error
    }
}

async function addToCart(user_id, product_id, quantity) {
    try {
        const sqlQuery =
            `INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity);`
        const result = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                [user_id, product_id, quantity],
                function (err, results) {
                    if (err) {
                        console.error(`error fetching cart:`, err)
                        reject(err)
                        return
                    }
                    resolve(results)
                }
            )
        })
        if (result)
        return getCartOfUser(user_id)
    } catch (error) {
        throw error
    }
}

async function reduceInCart(user_id, product_id, quantity) {
    try {
        const sqlQuery =
            `UPDATE cart_items
            SET quantity = CASE
                WHEN quantity - ? >= 1 THEN quantity - ?
                ELSE 1
            END
            WHERE user_id = ? AND product_id = ?;`
            
        const result = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                [quantity, quantity, user_id, product_id],
                function (err, results) {
                    if (err) {
                        console.error(`error fetching cart:`, err)
                        reject(err)
                        return
                    }
                    resolve(results)
                }
            )
        })
        if (result)
        return getCartOfUser(user_id)
    } catch (error) {
        throw error
    }
}

async function deleteFromCart(user_id, product_id) {
    try {
        const sqlQuery =
            `DELETE FROM cart_items
            WHERE user_id = ? AND product_id = ?;`
        const result = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                [user_id, product_id],
                function (err, results) {
                    if (err) {
                        console.error(`error fetching cart:`, err)
                        reject(err)
                        return
                    }
                    resolve(results)
                }
            )
        })
        if (result)
        return getCartOfUser(user_id)
    } catch (error) {
        throw error
    }
}

module.exports = {
    getCartOfUser,
    addToCart,
    reduceInCart,
    deleteFromCart
}