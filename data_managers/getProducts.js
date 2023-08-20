const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '4133',
    database: 'gps-store'
});

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

module.exports = getProducts;