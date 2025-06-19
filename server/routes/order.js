const express = require('express');
const router = express.Router();
const db = require("../db.js");

// ✅ Store Order
router.post('/store-order', async (req, res) => {
  const { items, totalOrder, paymentMethod, address } = req.body;
  const accountID = req.session.accountID;

  let conn;

  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    // 1) Insert into order
    const orderRes = await conn.query(
      `INSERT INTO \`order\` (accountID, status, totalAmount, orderedAt)
       VALUES (?, ?, ?, NOW())`,
      [accountID, 'Pending', totalOrder - 35]
    );
    const orderID = orderRes.insertId;

    // 2) Insert into order_item
    for (const item of items) {
      const totalPrice = item.price;
      const itemRes = await conn.query(
        `INSERT INTO order_item (orderID, productID, quantity, totalPrice)
         VALUES (?, ?, ?, ?)`,
        [orderID, item.productID, item.quantity, totalPrice]
      );
      const orderItemID = itemRes.insertId;

      // 3) Insert add-ons
      if (item.addOns?.length) {
        for (const addon of item.addOns) {
          await conn.query(
            `INSERT INTO order_item_addOn (orderItemID, addOnID, quantity)
             VALUES (?, ?, ?)`,
            [orderItemID, addon.addOnID, 1]
          );
        }
      }
    }

    // 4) Insert payment
    await conn.query(
      `INSERT INTO payment (orderID, paymentMethod, amountPaid, paymentStatus, paidAt)
       VALUES (?, ?, ?, ?, NOW())`,
      [orderID, paymentMethod, totalOrder, paymentMethod === 'Card' ? 'Paid' : 'Pending']
    );

    // 5) Insert delivery
    await conn.query(
      `INSERT INTO delivery (orderID, address, deliveryStatus)
       VALUES (?, ?, ?)`,
      [orderID, address || '', 'Pending']
    );

    await conn.commit();
    conn.release();

    res.json({ success: true, orderID });
  } catch (err) {
    if (conn) await conn.rollback();  // ✅ only rollback if connection exists
    console.error(err);
    res.status(500).json({ error: 'Failed to store order' });
  }
});

// ✅ Get Checkout User Profile
router.get('/checkoutUserProfile', (req, res) => {
  const read = `SELECT * FROM account WHERE accountID = ?`;
  db.query(read, [req.session.accountID], (err, getRes) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ userData: getRes[0] });
  });
});

module.exports = router;
