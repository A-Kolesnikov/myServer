const mysql = require('mysql2')
const conf = require('../config/configData')

const connection = mysql.createConnection({
    ...conf.dbSettings
})

async function addOrder(user_id, total_price) {
    try {
        const sqlQuery = 
        `INSERT INTO orders (user_id, total_price, date)
        VALUES (?, ?, NOW());`
        const result = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                [user_id, total_price],
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

async function addOrderDetail (order_id, item) {
    //const {id, quantity, price, name} = item
    try{
        const sqlQuery = 
        `INSERT INTO order_details (order_id, product_id, quantity, product_price, product_name)
        VALUES (?, ?, ?, ?, ?);`
        const result = await new Promise((resolve, reject) => {
            connection.query(
                sqlQuery,
                [order_id, item.id, item.quantity, item.price, item.name],
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
    }catch (error) {
        throw error
    }
}

module.exports = {
    addOrder,
    addOrderDetail
}