var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*res.render('index', { title: 'the club, buddy!' });*/
  res.send(`<html>
    <head></head>
    <body>
    <h1>Ahalan, ananas!</h1>
    </body>
    </html>`)
});

module.exports = router;
