const express = require('express');
const router = express.Router();
const db = require("../db.js");

router.post('/deleteCartItem', (req, res) => {
    const {cartItem} = req.body;
    const delItem = `DELETE FROM cart_item WHERE cartItemID = ?`;
    db.query(delItem, [cartItem], (err, delRes) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({message: 'Successfully deleted'});
    })    
})

router.get('/getCart', (req, res) => {
    const read = `
    SELECT
        c.cartItemID,
        c.accountID,
        c.productID,
        c.variantID,
        c.quantity,
        c.totalPrice,
        ca.cartAddOnID,
        ca.addOnID,
        bv.size AS variantSize,
        bv.price AS variantPrice,
        p.productName,
        p.productImgURL,
        p.price AS productBasePrice,
        p.category,
        p.drinkType,
        a.name as addOnName
    FROM cart_item c
    LEFT JOIN cart_item_addon ca ON c.cartItemID = ca.cartItemID
    LEFT JOIN beverage_variant bv ON c.variantID = bv.variantID
    JOIN product p ON c.productID = p.productID
    LEFT JOIN addon a ON ca.addOnID = a.addOnID
    WHERE c.accountID = ?`;

    db.query(read, req.session.accountID, (err, readRes) => {
        if (err) return res.status(500).json({ error: err.message });
        if(readRes.length === 0){
            return res.json({message:'No items'});
        } else{
            return res.json({message:'items fetched', cartList: readRes});
        }
    })
})

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
        } else {
            return res.json({ message: 'Added to cart (no add-ons)' });
        }

    })
})


module.exports = router;