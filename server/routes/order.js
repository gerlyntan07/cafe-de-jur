const express = require('express');
const router = express.Router();
const db = require("../db.js");

router.post('/store-order', (req, res) => {
  const { cleanedItems, totalItemPrice, paymentMethod, address } = req.body;
  const accountID = req.session.accountID;

  db.beginTransaction(async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Transaction start failed' });
    }

    // 1) Insert into order
    const orderQuery = `INSERT INTO order_summary (accountID, status, totalAmount, orderedAt) VALUES (?, ?, ?, NOW())`;
    db.query(orderQuery, [accountID, 'Paid', totalItemPrice], (err, orderRes) => {
      if (err) return rollback(err);

      const orderID = orderRes.insertId;

      const insertOrderItems = () => {
        return Promise.all(cleanedItems.map(item => {
          return new Promise((resolve, reject) => {
            const orderItemQuery = `INSERT INTO order_item (orderID, productID, variantID, quantity, totalItemPrice) VALUES (?, ?, ?, ?, ?)`;
            db.query(orderItemQuery, [orderID, item.productID, item.variantID, item.quantity, item.price], (err, itemRes) => {
              if (err) return reject(err);

              const orderItemID = itemRes.insertId;

              // Update product's totalSold
              const updateTotalSold = `UPDATE product SET totalSold = totalSold + ? WHERE productID = ?`;
              db.query(updateTotalSold, [item.quantity, item.productID], (err) => {
                if (err) return reject(err);

                if (item.addOns?.length > 0) {
                  const addonQueries = item.addOns.map(addon => {
                    return new Promise((resAdd, rejAdd) => {
                      const addOnQuery = `INSERT INTO order_item_addon (orderItemID, addOnID) VALUES (?, ?)`;
                      db.query(addOnQuery, [orderItemID, addon.addOnID], (err) => {
                        if (err) return rejAdd(err);
                        resAdd();
                      });
                    });
                  });

                  Promise.all(addonQueries).then(resolve).catch(reject);
                } else {
                  resolve();
                }
              });
            });
          });
        }));
      };

      insertOrderItems()
        .then(() => {
          const totalOrder = totalItemPrice + 35;
          const paymentQuery = `INSERT INTO payment (orderID, paymentMethod, amountPaid, paymentStatus, paidAt) VALUES (?, ?, ?, ?, NOW())`;
          db.query(paymentQuery, [orderID, paymentMethod, totalOrder, 'success'], (err) => {
            if (err) return rollback(err);

            const deliveryQuery = `INSERT INTO delivery (orderID, address, deliveryStatus, deliveredAt) VALUES (?, ?, ?, NOW())`;
            db.query(deliveryQuery, [orderID, address, 'delivered'], (err) => {
              if (err) return rollback(err);

              const cartItemIDs = cleanedItems
                .filter(item => item.cartID)
                .map(item => item.cartID);

              if (cartItemIDs.length > 0) {
                const deleteCartItemsQuery = `DELETE FROM cart_item WHERE cartItemID IN (?)`;
                db.query(deleteCartItemsQuery, [cartItemIDs], (err) => {
                  if (err) return rollback(err);
                })
              }

              db.commit((err) => {
                if (err) return rollback(err);
                res.json({ success: true, orderID });
              });
            });
          });
        })
        .catch(rollback);
    });

    function rollback(err) {
      db.rollback(() => {
        console.error('Rollback error:', err);
        res.status(500).json({ error: 'Failed to store order', details: err.message });
      });
    }
  });
});

router.get('/checkoutUserProfile', (req, res) => {
  const read = `SELECT * FROM account WHERE accountID = ?`;
  db.query(read, [req.session.accountID], (err, getRes) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ userData: getRes[0] });
  });
});

module.exports = router;
