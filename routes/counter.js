var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    req.session.numberOfCounts ? req.session.numberOfCounts++ : req.session.numberOfCounts = 1
        const counter = {counts: req.session.numberOfCounts};
        return res.status(200).json(counter); 
        //res.status(500).json({ error: "an error happened" })
});


module.exports = router;