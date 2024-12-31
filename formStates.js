const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const formStateSchema = new mongoose.Schema({
    signupForm: {
        type: Number,
        required: true
    },
    isOpen: {
        type: Boolean,
        required: true
    }
});

const FormState = mongoose.model('FormState', formStateSchema);

router.get('/', async (req, res) => {
    if (!req.query.signupForm) return res.status(400).send("Invalid query request");

    const formState = await FormState.find({ signupForm: req.query.signupForm });
    res.send(formState);
});

router.post('/', async (req, res) => {
    let formState = new FormState({
        signupForm: req.body.signupForm,
        isOpen: req.body.isOpen
    });
    const err = formState.validateSync();
    if (err) return res.status(400).send("Object validation failed.");

    formState = await formState.save();
    res.send(formState);
});

router.put('/:id', async (req, res) => {
    if (req.body.isOpen == undefined) return res.status(400).send("Invalid request body.");
    
    let formState = await FormState.findByIdAndUpdate(req.params.id, {
        $set: {
            isOpen: req.body.isOpen
        }
    }, { new: true });
    res.send(formState);
});

router.delete('/', async (req, res) => {
    const deletion = await FormState.deleteMany();
    numDeleted = deletion.deletedCount;
    if (numDeleted === 1) {
        res.send(`1 document deleted.`);
    } else {
        res.send(`${numDeleted} documents deleted.`);
    }
})

module.exports = router;