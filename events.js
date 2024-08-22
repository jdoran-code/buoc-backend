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
    date: { type: Date, required: true },
});

const Event = mongoose.model('Event', eventSchema);

async function createEvent() {
    const event = new Event({
        title: 'Mt. Major',
        date: new Date('September 13, 2024')
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
    const events = await Event.find();
    console.log(events);
}

createEvent();