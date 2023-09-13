var express = require('express')
var router = express.Router()
const conf = require('../config/configData')

const {getCategories, getCategoryByID, addCategory} = require('../data_managers/categoriesManager')
const { getCachedCategories, setCachedCategories} = require('../cache/categoriesCache')

const categoriesLifeTime = conf.cookieSettings.categoriesLifeTime

router.get('/', async function (req, res, next) {   //cookie based category fetching
        try {
            const categories = getCachedCategories()//await getCategories()
            const lifeTime = new Date(Date.now() + categoriesLifeTime)
            return res.status(200).cookie('categories', categories, {expires: lifeTime}).end()
        } catch (error) {
            return res.status(500).json({ error: error }).end()
        }
})

router.get('/:id', async function (req, res, next) {
    try{
        const id = req.params.id
        const category = await getCategoryByID(id)
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.post('/add', async function (req, res, next) {
    try{
        const newCategoryData = req.body // format {name, parentID, parentHierarchy?}
        
        const updatedCategoriesArr = await addCategory(newCategoryData)
        setCachedCategories(updatedCategoriesArr)
        res.status(201).json(updatedCategoriesArr)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

/*router.get('/', async function (req, res, next) { //session based category fetching
    if (req.session.categories){
        const categories = req.session.categories
        console.log('NOT fetching cats')
        res.status(200).json(categories)
    } else {
        try {
            const categories = await getCategories()
            console.log('fetching cats')
            req.session.categories = categories
            res.status(200).json(categories)
        } catch (error) {
            res.status(500).json({ error: error })
        }
    }
})*/

module.exports = router;