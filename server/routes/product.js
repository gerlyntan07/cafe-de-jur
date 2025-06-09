const express = require('express');
const router = express.Router();
const db = require("../db.js");

router.get('/getProductCount', (req, res) => {
    const countProd = `SELECT COUNT(*) AS productCount FROM product`;
    const countSold = `SELECT SUM(totalSold) AS totalSold FROM product`;
    db.query(countProd, (err, prodRes) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.query(countSold, (err, soldRes) => {
            if (err) return res.status(500).json({ error: err.message });

            console.log(prodRes[0].productCount + '\n' + soldRes[0].totalSold);
            res.json({
                product: prodRes[0].productCount,
                sold: soldRes[0].totalSold
            })
        })
    })
})

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