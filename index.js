const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/buoc')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const eventSchema = new mongoose.Schema({
    title: String,
    date: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', eventSchema);

async function createEvent() {
    const event = new Event({
        title: 'Mt. Willard',
    });
    
    const result = await event.save();
    console.log(result);
}

async function getEvents() {
    const events = await Event.find();
    console.log(events);
}

getEvents();