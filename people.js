const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/buoc')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

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

async function createPerson() {
    const person = new Person({
        name: 'Justin Doran',
        email: 'jdoran@bu.edu',
        isMember: true,
        numWaitlists: 0,
        meetingsAttended: 0,
        points: 0
    });

    try {
        const result = await person.save();
        console.log(person);
    } catch(ex) {
        console.log(ex.message);
    }
}

async function getPerson(nameStr, emailStr) {
    const person = await Person
        .find({ name: nameStr, email: emailStr })
        .select({ points: 1 });
    console.log(person);
}

async function updateMembership(id) {
    const person = await Person.findById(id);
    if (!person) return;

    person.isMember = true;
    person.points += 5;

    const result = await person.save();
    console.log(result);
}

async function updateWaitlists(id, addingWaitlist) {
    const person = await Person.findById(id);
    if (!person) return;

    if (addingWaitlist) {
        person.numWaitlists += 1;
        person.points += 4;
    } else {
        if (person.numWaitlists === 0 || person.points - 4 < 0) return;

        person.numWaitlists -= 1;
        person.points -= 4;
    }

    const result = await person.save();
    console.log(result);
}

async function updateMeetings(id) {
    const person = await Person.findById(id);
    if (!person) return;

    person.meetingsAttended += 1;
    person.points += 3;

    const result = await person.save();
    console.log(result);
}