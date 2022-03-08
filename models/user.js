const mongoose = require('mongoose');

// creating the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
})

// adding User collection/model of userSchema schema
const User = mongoose.model('User', userSchema);

// exporting the User Schema
module.exports = User;