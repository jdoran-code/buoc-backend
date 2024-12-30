const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const submissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: function(v) {
                let len = v.length;
                return v.substring(len - 7, len) === "@bu.edu";
            },
            message: "Invalid BU email."
        }
    },
    experience: {
        type: String
    },
    bonusAnswer: {
        type: String,
        required: true
    },
    signupForm: {
        type: Number,
        required: true
    },
    formInstance: {
        type: Number,
        required: true
    }
});

const Submission = mongoose.model('Submission', submissionSchema);

router.get('/', async (req, res) => {
    if (!req.query.formInstance) return res.status(400).send("Invalid query request");

    const submissions = await Submission.find({ formInstance: req.query.formInstance });
    res.send(submissions);
});

router.post('/', async (req, res) => {
    let submission = new Submission({
        name: req.body.name,
        email: req.body.email,
        experience: req.body.experience,
        bonusAnswer: req.body.bonusAnswer,
        signupForm: req.body.signupForm,
        formInstance: req.body.formInstance
    });
    const err = submission.validateSync();
    if (err) return res.status(400).send("Object validation failed.");

    submission = await submission.save();
    res.send(submission);
});

router.delete('/', async (req, res) => {
    const deletion = await Submission.deleteMany();
    numDeleted = deletion.deletedCount;
    if (numDeleted === 1) {
        res.send(`1 document deleted.`);
    } else {
        res.send(`${numDeleted} documents deleted.`);
    }
})

module.exports = router;