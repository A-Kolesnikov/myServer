var express = require('express');
var router = express.Router();


const { addOrder, addOrderDetail } = require('../data_managers/ordersManager')
const { decreaseInStock } = require('../data_managers/productsManager')
const { deleteFromCart } = require('../data_managers/cartManager')

router.post('/add', async function (req, res, next) {
  const {user_id, total_price, orderList} = req.body
  try {
    console.log('I am here')
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






/* GET orders listing. */
/*const orders = [
  {id:1, unit:'GPS-Receiver'},
  {id:2, unit: 'Ananas'}
]
router.get('/', function(req, res, next) {
  console.log("GOT YOUR REQUEST 1")
  //res.send('respond with a resource - CHANGED TEXT');
  res.json(orders)
});

router.get('/:orderId', (req, res) => {
  console.log("GOT YOUR REQUEST 2")
  const orderId = req.params.orderId
  const order = orders.find(order => order.id == parseInt(orderId))
  if(!order){
    return res.json({message: 'No such order'})
  }else{
    res.json(order)
  }
})*/

module.exports = router;
