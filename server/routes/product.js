const express = require('express');
const router = express.Router();
const db = require("../db.js");

router.post('/addtocart', (req, res) => {
    const { accountID, productNumber, selectedVariant, quantity, currentPrice, selectedAddOns } = req.body;
    const cartValues = [
        accountID,
        productNumber,
        selectedVariant,
        quantity,
        currentPrice
    ];
    const insertToCart = `INSERT INTO cart_item (accountID, productID, variantID, quantity, totalPrice)
    VALUES (?, ?, ?, ?, ?)`;

    db.query(insertToCart, cartValues, (err, cartRes) => {
        if (err) return res.status(500).json({ error: err.message });

        if (cartRes.affectedRows === 0) {
            res.status(500).json({ message: 'insert failed' });
        }

        const cartID = cartRes.insertId;
        if (selectedAddOns && selectedAddOns.length > 0) {
            const addOnValues = selectedAddOns.map(addOnID => [cartID, addOnID]);
            const insertToCartAddOn = `INSERT INTO cart_item_addon (cartItemID, addOnID)
            VALUES ?`;

            db.query(insertToCartAddOn, [addOnValues], (err, addOnRes) => {
                if (err) return res.status(500).json({ error: err.message });

                return res.json({ message: 'Added to cart with add-ons' });
            })
        } else{
            return res.json({ message: 'Added to cart (no add-ons)' });
        }

    })
})

router.post('/getSelectedProduct', (req, res) => {
    const { selectedProductID } = req.body;
    const readProduct = `SELECT 
        p.productID,
        p.productName,
        p.category,
        p.description,
        p.productImgURL,
        p.drinkType,
        bv.variantID,
        bv.size,
        bv.price,
        p.price AS base_price
    FROM product p
    LEFT JOIN beverage_variant bv ON p.productID = bv.productID
    WHERE p.productID = ?`;

    db.query(readProduct, [selectedProductID], (err, productRes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (productRes.length > 0) {
            const category = productRes[0].category;
            const readAddOns = `SELECT * FROM addon WHERE category = ?`;
            db.query(readAddOns, [category], (err, addOnsRes) => {
                if (err) return res.status(500).json({ error: err.message });
                if (addOnsRes.length > 0) {
                    res.json({ productDetails: productRes, addOnsList: addOnsRes });
                }
            })
        }
    })
})

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
    const readAll = `SELECT 
      p.productID,
      p.productName,
      p.category,
      p.productImgURL,
      p.drinkType,
      MIN(bv.price) AS min_price,
      MAX(bv.price) AS max_price,
      p.price AS base_price
    FROM product p
    LEFT JOIN beverage_variant bv ON p.productID = bv.productID
    GROUP BY p.productID`
    db.query(readAll, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length > 0) {
            res.json({ message: 'Products fetched', productList: result });
        } else {
            res.json({ message: 'No product available' });
        }
    })
})


module.exports = router;