const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const personSchema = new mongoose.Schema({
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
    isMember: {
        type: Boolean,
        required: true
    },
    numWaitlists: {
        type: Number,
        required: true,
        min: 0
    },
    meetingsAttended: {
        type: Number,
        required: true,
        min: 0
    },
    points: {
        type: Number,
        required: true,
        min: 0
    }
});

const Person = mongoose.model('Person', personSchema);

router.get('/', async (req, res) => {
    if (!req.query.name || !req.query.email) return res.status(400).send("Invalid query request.");

    const person = await Person
        .find({ name: req.query.name, email: req.query.email })
        .select({ name: 1, email: 1, points: 1 });
    if (person.length === 0) return res.status(404).send('There is no person with the given name and email.');
    res.send(person);
});

router.post('/', async (req, res) => {
    let person = new Person({
        name: req.body.name,
        email: req.body.email,
        isMember: req.body.isMember,
        numWaitlists: req.body.numWaitlists,
        meetingsAttended: req.body.meetingsAttended,
        points: req.body.points
    });
    const err = person.validateSync();
    if (err) return res.status(400).send("Object validation failed.");

    person = await person.save();
    res.send(person);
});

router.put('/:id', async (req, res) => {
    let person = await Person.findById(req.params.id);
    if (!person) return res.status(404).send('There is no person with the given id.');

    if (req.body.isMember) person.isMember = req.body.isMember;
    if (req.body.numWaitlists) person.numWaitlists = req.body.numWaitlists;
    if (req.body.meetingsAttended) person.meetingsAttended = req.body.meetingsAttended;
    if (req.body.points) person.points = req.body.points;

    const err = person.validateSync();
    if (err) return res.status(400).send("Update validation failed.");

    person = await person.save();
    res.send(person);
});

router.delete('/', async (req, res) => {
    const deletion = await Person.deleteMany();
    numDeleted = deletion.deletedCount;
    if (numDeleted === 1) {
        res.send(`1 document deleted.`);
    } else {
        res.send(`${numDeleted} documents deleted.`);
    }
});

module.exports = router;