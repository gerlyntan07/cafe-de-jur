const express = require('express');
const router = express.Router();
const db = require("../db.js");
const bcrypt = require("bcrypt");

router.use(express.json());

//address
router.post('/saveAddress', (req,res) => {
    const formattedAddress = req.body.formattedAddress;
    const updateQuery = `UPDATE account SET address = ? WHERE accountID = ?`;
    db.query(updateQuery, [formattedAddress, req.session.accountID], (err, insertRes) => {
        if (err) return res.status(500).json({ error: err.message });
        if(insertRes.affectedRows > 0){
            res.json({message: 'successful'});
        } else{
            res.status(400).json({message: 'Error adding address'});
        }
    })
})

router.get('/getAddress', (req, res) => {
    const readAddress = `SELECT * FROM account WHERE accountID = ?`;
    db.query(readAddress, req.session.accountID, (err, readRes) => {
        if (err) return res.status(500).json({ error: err.message });
        if(readRes.length > 0){
            const user = readRes[0];
            if(user.address === null || user.address === ''){
                res.json({message: 'Address not found'});
            }else{
                res.json({message: 'Address found', userAddress: user.address })
            }
        } else if(readRes.length === 0){
            res.status(404).json({message: 'Account not found'})
        }
    })
})

//pass
router.post('/changePass', async(req, res) => {
    const { currPass, newPass } = req.body;    
    const readPass = `SELECT * FROM account WHERE accountID = ?`;
    db.query(readPass, req.session.accountID, async(err, passRes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (passRes.length > 0) {
            const user = passRes[0];            
            bcrypt.compare(currPass, user.password, async(err, isMatch) => {
                if (err) {
                    return res.json({ message: "Error in password comparison", isLoggedIn: false });
                }
                if (isMatch) {
                    const update = `UPDATE account SET password = ? WHERE accountID = ?`;
                    const hashedPassword = await bcrypt.hash(newPass, 10);
                    const values = [
                        hashedPassword,
                        req.session.accountID
                    ];
                    db.query(update, values, (err, updateRes) => {
                        if (err) return res.status(500).json({ error: err.message });
                        if(updateRes.affectedRows > 0){
                            res.json({message: 'Your password has been changed successfully.'})
                        } else{
                            res.status(400).json({ message: 'Unable to change password.' })
                        }
                    })
                } else{
                    return res.status(401).json({ message: 'Incorrect password. Please try again.', isLoggedIn: false });
                }
            })
        } else{
            return res.status(404).json({ message: 'Email not found. Please try again.'});
        }
    })
})

router.post('/updateProfile', (req, res) => {
    const { firstname, lastname, phone, email } = req.body;
    const values = [
        firstname,
        lastname,
        email,
        phone,
        req.session.accountID,
    ];
    const update = `UPDATE account
    SET firstname = ?,
        lastname = ?,
        email = ?,
        phoneNum = ?
    WHERE accountID = ?`;
    db.query(update, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows > 0) {
            res.json({ message: 'Profile updated successfully.' })
        } else {
            res.status(400).json({ message: 'Unable to update user account.' })
        }
    })
})

module.exports = router;