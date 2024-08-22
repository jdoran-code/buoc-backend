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

async function updatePerson(id, updateKey) {
    /*
    updateKey === 0 -> Made a member
    === 1 -> Waitlisted for trip
    === 2 -> Attended a meeting
    */
    const person = await Person.findById(id);
    if (!person || updateKey >= 3) return;

    if (updateKey === 0) {
        person.isMember = true;
        person.points += 5;
    } else if (updateKey === 1) {
        person.numWaitlists += 1;
        person.points += 4;
    } else {
        person.meetingsAttended += 1;
        person.points += 3;
    }

    const result = await person.save();
    console.log(result);
}

updatePerson('66c502f28dff5f56865bd78c', 0);