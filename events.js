const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const eventSchema = new mongoose.Schema({
    organizer: {
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
    },
    title: {
        type: String,
        required: true,
        maxLength: 50
    },
    date: { 
        type: Date, 
        required: true 
    },
    numDays: {
        type: Number,
        required: true,
        min: 1
    },
    isTrip: {
        type: Boolean,
        required: true
    },
    signupForm: {
        type: Number,
        required: function() { return this.isTrip; },
        min: 0,
        max: 9
    },
    numSeats: {
        type: Number,
        min: 1,
        required: function() { return this.isTrip; }
    },
    prospectList: {
        type: Array,
        required: function() { return this.isTrip; }
    },
    waitlist: {
        type: Array,
        required: function() { return this.isTrip; }
    },
    tripRoster: {
        type: Array,
        required: function() { return this.isTrip; },
        validate: {
            validator: function(v) {
                return (v.length <= this.numSeats) || !this.isTrip;
            },
            message: "Roster length must be less than number of seats."
        }
    }
});

const Event = mongoose.model('Event', eventSchema);

router.get('/', async (req, res) => {
    if (req.query.organizer) {
        const events = await Event
            .find({ organizer: req.query.organizer })
            .sort({ date: -1 });
        if (events.length === 0) res.status(404).send("There are no events with the given organizer");
        res.send(events);
    } else {
        const events = await Event
            .find()
            .sort({ date: -1 });
        res.send(events);
    }
});

router.post('/', async (req, res) => {
    let event = new Event({
        organizer: req.body.organizer,
        title: req.body.title,
        date: req.body.date,
        numDays: req.body.numDays,
        isTrip: req.body.isTrip,
        signupForm: req.body.signupForm,
        numSeats: req.body.numSeats,
        prospectList: req.body.prospectList,
        waitlist: req.body.waitlist,
        tripRoster: req.body.tripRoster
    });
    const err = event.validateSync();
    if (err) return res.status(400).send("Object validation failed.");

    event = await event.save();
    res.send(event);
});

router.put('/:id', async (req, res) => {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('There is no event with the given id.');

    if (req.body.title) event.title = req.body.title;
    if (req.body.date) event.date = req.body.date;
    if (req.body.numDays) event.numDays = req.body.numDays;
    if (req.body.numSeats) event.numSeats = req.body.numSeats;
    if (req.body.waitlist) event.waitlist = req.body.waitlist;
    if (req.body.tripRoster) event.tripRoster = req.body.tripRoster;

    const err = event.validateSync();
    if (err) return res.status(400).send("Update validation failed.");

    event = await event.save();
    res.send(event);
});

router.delete('/', async (req, res) => {
    const deletion = await Event.deleteMany();
    numDeleted = deletion.deletedCount;
    if (numDeleted === 1) {
        res.send(`1 document deleted.`);
    } else {
        res.send(`${numDeleted} documents deleted.`);
    }
});

router.get('/:id', async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('There is no event with the given id.');
    res.send(event);
});

module.exports = router;