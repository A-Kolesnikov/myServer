var express = require('express');
var router = express.Router();

const {getCategoryByID, addCategory} = require('../data_managers/categoriesManager')
const {getProduct, getProducts} = require('../data_managers/productsManager')

router.get('/', async function (req, res, next) {
    try {
        const products = await getProducts()
        res.status(200).json(products)
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

router.post('/categories/add', async function (req, res, next) {
    const newCategoryData = req.body // format {name, parentID, parentHierarchy?}
    const answer = await addCategory(newCategoryData)
    res.status(200).json(answer)
})

module.exports = router;