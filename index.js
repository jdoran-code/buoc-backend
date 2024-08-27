const config = require('config');
const mongoose = require('mongoose');
const events = require('./events');
const people = require('./people');
const auth = require('./auth');
const attendanceCodes = require('./attendanceCodes');
const express = require('express');
const app = express();

if (!config.get('passcode')) {
    console.error('FATAL ERROR: passcode is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/buoc')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(cors());
app.use('/api/events', events);
app.use('/api/people', people);
app.use('/api/auth', auth);
app.use('/api/attendanceCodes', attendanceCodes);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));