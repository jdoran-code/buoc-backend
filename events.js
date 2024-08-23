const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/buoc')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const eventSchema = new mongoose.Schema({
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

async function createEvent() {
    const event = new Event({
        title: 'Acadia',
        date: new Date('October 8, 2024'),
        numDays: 3,
        isTrip: true,
        signupForm: 0,
        numSeats: 5,
        prospectList: [{ name: 'Justin Doran', email: 'jdoran@bu.edu' }, { name: "Bobby Brown", email: 'brown@bu.edu' }],
        waitlist: [{ name: "Bobby Brown", email: 'brown@bu.edu' }],
        tripRoster: [{ name: 'Justin Doran', email: 'jdoran@bu.edu' }]
    });
    
    try {
        const result = await event.save();
        console.log(result);
    }
    catch(ex) {
        console.log(ex.message);
    }
}

async function getEvents() {
    const events = await Event
        .find()
        .sort({ date: 1 });
    console.log(events);
}

async function updateTitle(id, title) {
    const event = await Event.findById(id);
    if (!event) return;

    event.title = title;

    const result = await event.save();
    console.log(result);
}

async function updateDate(id, date) {
    const event = await Event.findById(id);
    if (!event) return;

    event.date = date;

    const result = await event.save();
    console.log(result);
}

async function updateNumDays(id, numDays) {
    const event = await Event.findById(id);
    if (!event) return;

    event.numDays = numDays;

    const result = await event.save();
    console.log(result);
}

async function updateNumSeats(id, numSeats) {
    const event = await Event.findById(id);
    if (!event) return;

    event.numSeats = numSeats;

    const result = await event.save();
    console.log(result);
}

async function updateRoster(id) {
    const event = await Event.findById(id);
    if (!event || event.tripRoster.length === event.numSeats) return;

    const newPerson = event.waitlist.pop();
    event.tripRoster.push(newPerson);

    const result = await event.save();
    console.log(result);
}

updateRoster('66c8d99b97d762e5b49d42be');