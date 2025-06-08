const express = require('express');
const router = express.Router();
const db = require("../db.js");

router.get('/getProducts', (req, res) => {
    const readAll = `SELECT * FROM product`
    db.query(readAll, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if(result.length > 0){
            res.json({message: 'Products fetched', productList: result});
        } else{
            res.json({message: 'No product available'});
        }
    })
})


module.exports = router;