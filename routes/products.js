var express = require('express');
var router = express.Router();

const getProducts = require('../data_managers/getProducts')
const getProduct = require('../data_managers/getProduct')
const {getCategoryByID} = require('../data_managers/categoriesManager')

/* GET products listing. */
router.get('/', async function (req, res, next) {
    try {
        const products = await getProducts();
        res.json(products); 
    } catch (error) {
        res.status(500).json({ error: "an error happened" })
    }
});

router.get('/:id', async function (req, res, next) {
    const id = req.params.id
    const product = await getProduct(id)
    res.json(product)
})

router.get('/categories/:id', async function (req, res, next) {
    const id = req.params.id
    const category = await getCategoryByID(id)
    res.status(200).json(category)
})

module.exports = router;