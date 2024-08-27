const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const loginSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    user: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                if (v.length !== 9) {
                    return false;
                }
              
                if (v.charAt(0) !== "U") {
                    return false;
                }
              
                const digits = "0123456789";
                for (let i = 1; i < 9; i++) {
                    if (digits.indexOf(v.charAt(i)) === -1) {
                      return false;
                    }
                }
              
                return true;
            }
        }
    }
});

const Login = mongoose.model('Login', loginSchema);

router.get('/', async (req, res) => {
    const logins = await Login
        .find()
        .sort({ date: -1 });
    res.send(logins);
});

router.post('/', async (req, res) => {
    if (!req.body.passcode) return res.status(400).send('Passcode required.');
    
    const correctPasscode = config.get('passcode');
    if (req.body.passcode !== correctPasscode) return res.status(400).send('Incorrect passcode.');

    let login = new Login({
        date: new Date(),
        user: req.body.user
    });
    const err = login.validateSync();
    if (err) return res.status(400).send("Invalid BU ID.");

    login = await login.save();
    res.send(login);
});

router.delete('/', async (req, res) => {
    const deletion = await Login.deleteMany();
    numDeleted = deletion.deletedCount;
    if (numDeleted === 1) {
        res.send(`1 document deleted.`);
    } else {
        res.send(`${numDeleted} documents deleted.`);
    }
});

module.exports = router;