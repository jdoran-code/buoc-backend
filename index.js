const mongoose = require('mongoose');
const events = require('./events');
const people = require('./people');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/buoc')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use('/api/events', events);
app.use('/api/people', people);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));