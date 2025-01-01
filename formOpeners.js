const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const formOpenerSchema = new mongoose.Schema({
    signupForm: {
        type: Number,
        required: true
    },
    isOpen: {
        type: Boolean,
        required: true
    }
});

const FormOpener = mongoose.model('FormOpener', formOpenerSchema);

router.get('/', async (req, res) => {
    if (!req.query.signupForm) return res.status(400).send("Invalid query request");

    const formOpener = await FormOpener.find({ signupForm: req.query.signupForm });
    res.send(formOpener);
});

router.post('/', async (req, res) => {
    let formOpener = new FormOpener({
        signupForm: req.body.signupForm,
        isOpen: req.body.isOpen
    });
    const err = formOpener.validateSync();
    if (err) return res.status(400).send("Object validation failed.");

    formOpener = await formOpener.save();
    res.send(formOpener);
});

router.put('/:id', async (req, res) => {
    if (req.body.isOpen == undefined) return res.status(400).send("Invalid request body.");
    
    let formOpener = await FormOpener.findByIdAndUpdate(req.params.id, {
        $set: {
            isOpen: req.body.isOpen
        }
    }, { new: true });
    if (formOpener) res.send(formOpener);
});

router.delete('/', async (req, res) => {
    const deletion = await FormOpener.deleteMany();
    numDeleted = deletion.deletedCount;
    if (numDeleted === 1) {
        res.send(`1 document deleted.`);
    } else {
        res.send(`${numDeleted} documents deleted.`);
    }
})

module.exports = router;