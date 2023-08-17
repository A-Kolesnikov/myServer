var express = require('express');
var router = express.Router();

/* GET orders listing. */
const orders = [
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
})

module.exports = router;
