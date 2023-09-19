var express = require('express')
var router = express.Router()

const {
    getCartOfUser,
    addToCart,
    reduceInCart,
    deleteFromCart } = require('../data_managers/cartManager')

router.get('/by-user/:id', async function (req, res, next) {
    const user_id = req.params.id
    try {
        const currentCart = await getCartOfUser(user_id)
        res.status(200).json(currentCart)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.post('/add-product', async function (req, res, next) {
    const { user_id, product_id, quantity } = req.body
    try {
        const updatedCart = await addToCart(user_id, product_id, quantity)
        //res.sendStatus(updatedCart ? 201 :409 )
        res.status(201).json(updatedCart)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.post('/reduce-product', async function (req, res, next) {
    const { user_id, product_id, quantity } = req.body
    try {
        const updatedCart = await reduceInCart(user_id, product_id, quantity)
        //res.sendStatus(updatedCart ? 201 :409 )
        res.status(201).json(updatedCart)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.post('/delete-product', async function (req, res, next) {
    const { user_id, product_id } = req.body
    try {
        const updatedCart = await deleteFromCart(user_id, product_id)
        //res.sendStatus(updatedCart ? 201 :409 )
        res.status(201).json(updatedCart)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

module.exports = router