'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    username: { type: String, required: true, index: true },
    password: String,   // TODO encrypt the password with bcrypt?
    organization: { type: String, index: true },
    nas: String,
    created: { type: Date, default: Date.now }

}, {
    versionKey: false,
    collection: 'users',
    autoIndex: process.env.NODE_ENV !== 'production'
});

mongoose.model('Users', userSchema);