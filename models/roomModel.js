
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    roomcode: String
});

module.exports = mongoose.model('Room', schema);

