const express = require('express');
const router = express.Router();
const db = require("../db.js");

router.get('/admin-getPaidOrders', (req, res) => {
  const readOrders = `
    SELECT
      os.orderID,
      os.status AS orderStatus,
      os.totalAmount,
      os.orderedAt,
      p.paymentID,
      p.paymentMethod,
      p.amountPaid,
      p.paymentStatus,
      p.paidAt,
      a.accountID,
      a.firstname,
      a.lastname,
      a.email,
      a.address,
      a.phoneNum
    FROM order_summary os
    LEFT JOIN account a ON os.accountID = a.accountID
    LEFT JOIN payment p ON os.orderID = p.orderID
    WHERE os.status = 'paid'
    ORDER BY os.orderedAt DESC
  `;

  db.query(readOrders, (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });

    const orderIDs = orders.map(o => o.orderID);
    if (orderIDs.length === 0) {
      return res.json({ paidOrders: [] });
    }

    const placeholders = orderIDs.map(() => '?').join(',');
    const readItems = `
      SELECT
        oi.orderItemID,
        oi.orderID,
        oi.productID,
        p.productName,
        oi.variantID,
        bv.size,
        oi.quantity,
        oi.totalItemPrice,
        oia.addOnID,
        a.name AS addOnName
      FROM order_item oi
      LEFT JOIN product p ON oi.productID = p.productID
      LEFT JOIN beverage_variant bv ON oi.variantID = bv.variantID
      LEFT JOIN order_item_addon oia ON oi.orderItemID = oia.orderItemID
      LEFT JOIN addon a ON oia.addOnID = a.addOnID
      WHERE oi.orderID IN (${placeholders})
    `;

    db.query(readItems, orderIDs, (err, items) => {
      if (err) return res.status(500).json({ error: err.message });

      // Group items by orderID
      const groupedItems = {};
      items.forEach(item => {
        if (!groupedItems[item.orderID]) groupedItems[item.orderID] = {};
        if (!groupedItems[item.orderID][item.orderItemID]) {
          groupedItems[item.orderID][item.orderItemID] = {
            orderItemID: item.orderItemID,
            productName: item.productName,
            size: item.size,
            quantity: item.quantity,
            totalItemPrice: item.totalItemPrice,
            addOns: item.addOnName ? [item.addOnName] : []
          };
        } else if (item.addOnName) {
          groupedItems[item.orderID][item.orderItemID].addOns.push(item.addOnName);
        }
      });

      // Attach items to each order
      const result = orders.map(order => {
        const items = Object.values(groupedItems[order.orderID] || {});
        return { ...order, items };
      });

      return res.json({ paidOrders: result });
    });
  });
});


router.post('/getSelectedOrder', (req, res) => {
  const { orderID } = req.body;
  const read = `
  SELECT
    oi.orderItemID,
    oi.orderID,
    oi.productID,
    p.productName,
    oi.variantID,
    bv.size,
    oi.quantity,
    oi.totalItemPrice,
    oa.orderAddOnID,
    oa.addOnID,
    a.name AS addOnName,
    os.totalAmount,
    os.orderedAt
FROM order_item oi
LEFT JOIN product p ON oi.productID = p.productID
LEFT JOIN beverage_variant bv ON oi.variantID = bv.variantID
LEFT JOIN order_item_addon oa ON oi.orderItemID = oa.orderItemID
LEFT JOIN addon a ON oa.addOnID = a.addOnID
LEFT JOIN order_summary os ON oi.orderID = os.orderID
WHERE oi.orderID = ? AND os.accountID = ?
`;
  db.query(read, [orderID, req.session.accountID], (err, getOrderRes) => {
    if (err) return res.status(500).json({ error: err.message });

    const read2 = `
    SELECT
      os.orderID,
      os.totalAmount,
      p.paymentID,
      p.paymentMethod,
      p.amountPaid,
      p.paidAt,
      d.deliveryID,
      d.address,
      d.deliveredAt
      FROM order_summary os
      LEFT JOIN payment p ON os.orderID = p.orderID
      LEFT JOIN delivery d ON os.orderID = d.orderID
      WHERE os.orderID = ? AND os.accountID = ?`;
    db.query(read2, [orderID, req.session.accountID], (err, getPaymentRes) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ orderDetails: getOrderRes, paymentDetails: getPaymentRes[0] });
    })
  })
})

router.post('/getPaidOrders', (req, res) => {
  const read = `SELECT
    os.orderID,
    os.status AS orderStatus,
    os.totalAmount,
    os.orderedAt,
    p.paymentID,
    p.paymentMethod,
    p.amountPaid,
    p.paymentStatus,
    p.paidAt
  FROM order_summary os
  LEFT JOIN payment p ON os.orderID = p.orderID
  WHERE os.accountID = ? AND os.status = 'paid'
  ORDER BY os.orderedAt DESC`;
  db.query(read, [req.session.accountID], (err, getRes) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ paidOrders: getRes })
  })
})

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
