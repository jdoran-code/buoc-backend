const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const attendanceCodeSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    code: {
        type: Number,
        required: true
    }
});

const AttendanceCode = mongoose.model('AttendanceCode', attendanceCodeSchema);

router.get('/', async (req, res) => {
    const attendanceCode = await AttendanceCode
        .find()
        .sort({ date: -1 })
        .limit(1)
        .select({ _id: 0, code: 1 });
    res.send(attendanceCode);
});

router.post('/', async (req, res) => {
    let attendanceCode = new AttendanceCode({
        date: new Date(),
        code: Math.floor(Math.random() * (1000000 - 100000) + 100000)
    });
    const err = attendanceCode.validateSync();
    if (err) return res.status(400).send("Object validation failed.");

    attendanceCode = await attendanceCode.save();
    res.send(attendanceCode);
});

router.delete('/', async (req, res) => {
    const deletion = await AttendanceCode.deleteMany();
    numDeleted = deletion.deletedCount;
    if (numDeleted === 1) {
        res.send(`1 document deleted.`);
    } else {
        res.send(`${numDeleted} documents deleted.`);
    }
});

module.exports = router;