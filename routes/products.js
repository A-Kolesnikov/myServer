var express = require('express');
var router = express.Router();

const {getCategoryByID, addCategory} = require('../data_managers/categoriesManager')
const {getProduct, getProducts, getProductsOfCategory} = require('../data_managers/productsManager')

router.get('/', async function (req, res, next) {
    try {
        const products = await getProducts()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ error: "an error happened" })
    }
});

router.get('/product/:id', async function (req, res, next) {
    const id = req.params.id
    const product = await getProduct(id)
    res.status(200).json(product)
})

router.get('/of-category/:id', async function (req, res, next) {
    const id = req.params.id
    const products = await getProductsOfCategory(id)
    res.status(200).json(products)
})
module.exports = router;