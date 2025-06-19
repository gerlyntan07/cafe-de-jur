const express = require('express');
const router = express.Router();
const db = require("../db.js");

router.post('/addProduct', (req, res) => {
    const { productData } = req.body;

    const addProductQuery = `
        INSERT INTO product (productName, productImgURL, description, price, category, drinkType, isDeleted)
        VALUES (?, ?, ?, ?, ?, ?, '0')
    `;

    const productValues = [
        productData.productName,
        productData.image,
        productData.description,
        productData.price,
        productData.category,
        productData.drinkType,
    ];

    db.query(addProductQuery, productValues, (err, productRes) => {
        if (err) return res.status(500).json({ error: err.message });

        const insertedProductID = productRes.insertId;

        // If there are no variants (e.g., non-Beverage), return early
        if (!productData.variants || productData.variants.length === 0) {
            return res.json({ success: true, productID: insertedProductID });
        }

        const variantInserts = productData.variants.map(variant => {
            return new Promise((resolve, reject) => {
                const insertVariantQuery = `
                    INSERT INTO beverage_variant (productID, size, price)
                    VALUES (?, ?, ?)
                `;
                const variantValues = [
                    insertedProductID,
                    variant.size,
                    parseFloat(variant.price),
                ];

                db.query(insertVariantQuery, variantValues, (err, variantRes) => {
                    if (err) reject(err);
                    else resolve(variantRes);
                });
            });
        });

        Promise.all(variantInserts)
            .then(() => {
                return res.json({ success: true, productID: insertedProductID });
            })
            .catch(err => {
                return res.status(500).json({ error: err.message });
            });
    });
});


router.post('/editProduct', (req, res) => {
    const { productData } = req.body;

    const editProductQuery = `UPDATE product
        SET productName = ?,
            description = ?,
            price = ?,
            productImgURL = ?
        WHERE productID = ?`;

    const productValues = [
        productData.productName,
        productData.description,
        productData.base_price,
        productData.image,
        productData.productID,
    ];

    db.query(editProductQuery, productValues, (err, productRes) => {
        if (err) return res.status(500).json({ error: err.message });

        const variantUpdates = productData.variants.map(variant => {
            return new Promise((resolve, reject) => {
                const updateVariantQuery = `UPDATE beverage_variant
                    SET size = ?, price = ?
                    WHERE variantID = ?`;

                const variantValues = [
                    variant.size,
                    variant.price,
                    variant.variantID,
                ];

                db.query(updateVariantQuery, variantValues, (err, variantRes) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(variantRes);
                    }
                });
            });
        });

        Promise.all(variantUpdates)
            .then(() => {
                return res.json({ success: true });
            })
            .catch(err => {
                return res.status(500).json({ error: err.message });
            });
    });
});

router.post('/getProductDetails', (req, res) => {
    const {productID} = req.body;
    const getProd = `SELECT 
      p.productID,
      p.description,
      bv.variantID,
      bv.size,
      bv.price AS pricePerSize,
      p.price AS base_price
    FROM product p
    LEFT JOIN beverage_variant bv ON p.productID = bv.productID
    WHERE isDeleted = '0' AND p.productID = ?
    `;

    db.query(getProd, [productID], (err, getRes) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({productInfo: getRes, description: getRes[0].description});
    })
})

router.put('/deleteProduct', (req, res) => {
    const {productID} = req.body;
    const del = `UPDATE product SET isDeleted = '1' WHERE productID = ?`;
    db.query(del, [productID], (err, delRes) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({message: 'Product deleted'});
    })
})

router.post('/getVariantName', (req, res) => {
    const {selectedVariant} = req.body;
    const read = `SELECT * FROM beverage_variant WHERE variantID = ?`;
    db.query(read, selectedVariant, (err, variantRes) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({variantName: variantRes[0].size});
    })
})

router.get('/productSearch/:search', (req, res) => {
    const { search } = req.params;    
    const query = `
    SELECT 
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
    WHERE
        (LOWER(p.productName) LIKE LOWER(?) OR
        LOWER(p.description) LIKE LOWER(?) OR
        LOWER(p.category) LIKE LOWER(?) OR
        LOWER(p.drinkType) LIKE LOWER(?))
    GROUP BY p.productID
  `;

  const searchKeyword = `%${search}%`;
    db.query(query, [searchKeyword, searchKeyword, searchKeyword, searchKeyword], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({results: results});
    });
});


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
    const countProd = `SELECT COUNT(*) AS productCount FROM product WHERE isDeleted='0'`;
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
      p.totalSold,
      MIN(bv.price) AS min_price,
      MAX(bv.price) AS max_price,
      p.price AS base_price
    FROM product p
    LEFT JOIN beverage_variant bv ON p.productID = bv.productID
    WHERE isDeleted = '0'
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