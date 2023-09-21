var express = require('express')
var router = express.Router()

const {getCategoryByID, addCategory} = require('../data_managers/categoriesManager')
const {getProduct, getProducts, getProductsWithIDs, getProductsOfCategory, getProductsByTag} = require('../data_managers/productsManager')

router.get('/', async function (req, res, next) {
    try {
        const products = await getProducts()
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.get('/product/:id', async function (req, res, next) {
    const id = req.params.id
    const product = await getProduct(id)
    res.status(200).json(product)
})

router.get('/with-ids/:ids', async function (req, res, next) {
    const ids = req.params.ids
    try{
        const products = await getProductsWithIDs(ids)
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.get('/of-category/:id', async function (req, res, next) {
    const id = req.params.id
    try {
        const products = await getProductsOfCategory(id)
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.get('/by-tag/:tag', async function (req, res, next) {
    const tag = req.params.tag
    try {
        const products = await getProductsByTag(tag)
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

module.exports = router