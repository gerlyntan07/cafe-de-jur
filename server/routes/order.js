const express = require('express');
const router = express.Router();
const db = require("../db.js");

router.get('/checkoutUserProfile', (req, res) => {
    const read = `SELECT * FROM account WHERE accountID = ?`;

    db.query(read, [req.session.accountID], (err, getRes) => {
        if (err) return res.status(500).json({ error: err.message });
        
        return res.json({userData: getRes[0]});
    })
})

module.exports = router;