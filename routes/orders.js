var express = require('express');
var router = express.Router();


const { addOrder, addOrderDetail, getOrdersOfUser, getOrderDetails } = require('../data_managers/ordersManager')
const { decreaseInStock } = require('../data_managers/productsManager')
const { deleteFromCart } = require('../data_managers/cartManager')

router.post('/add', async function (req, res, next) {
  const {user_id, total_price, orderList} = req.body
  try {
    const order = await addOrder(user_id, total_price)
    const order_id = order.insertId
    for (const item of orderList){
      const decrease = await decreaseInStock(item.id, item.quantity)
      if (decrease.changedRows === 1){
        const orderDetail = await addOrderDetail(order_id, item)
        const deletedFromCart = await deleteFromCart(user_id, item.id)
      }
    }

    res.status(201).json({order_id: order_id})
} catch (err) {
    res.status(500).json({ error: err })
}
})

router.get('/by-user/:id', async function (req, res, next) {
  const user_id = req.params.id
  try {
    const result = []
      const orders = await getOrdersOfUser(user_id)
      if(orders && orders[0]){
        for (const order of orders){
          const itemList = await getOrderDetails(order.id)
          order.itemList = [...itemList]
          result.push(order)
        }
      }
      res.status(200).json(result)
  } catch (err) {
      res.status(500).json({ error: err })
  }
})

module.exports = router;
