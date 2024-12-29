const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const signupFormSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    tripName: {
        type: String,
        required: true
    },
    isDifficultHike: {
        type: Boolean,
        required: true
    },
    bonusQuestion: {
        type: String,
        required: true
    }
});

const SignupForm = mongoose.model('SignupForm', signupFormSchema);

router.get('/', async (req, res) => {
    const signupForm = await SignupForm
        .find()
        .sort({ date: -1 })
        .limit(1);
    res.send(signupForm);
});

router.post('/', async (req, res) => {
    let signupForm = new SignupForm({
        date: new Date(),
        tripName: req.body.tripName,
        isDifficultHike: req.body.isDifficultHike,
        bonusQuestion: req.body.bonusQuestion
    });
    const err = signupForm.validateSync();
    if (err) return res.status(400).send("Object validation failed.");

    signupForm = await signupForm.save();
    res.send(signupForm);
});

router.delete('/', async (req, res) => {
    const deletion = await SignupForm.deleteMany();
    numDeleted = deletion.deletedCount;
    if (numDeleted === 1) {
        res.send(`1 document deleted.`);
    } else {
        res.send(`${numDeleted} documents deleted.`);
    }
})

module.exports = router;