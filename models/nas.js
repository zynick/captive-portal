'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nasSchema = new Schema({

    id: { type: String, required: true, index: true, unique: true },
    organization: { type: String, required: true, index: true },

    // sample format:
    // { enabled: true, email: true, facebook: true, google: true, ... }
    login: Schema.Types.Mixed,

    assets: {
        logo: String,
        url: String,
        slogan: String
    },

    secret: String,
    lastseen: Date

}, {
    versionKey: false,
    collection: 'nas',
    autoIndex: process.env.NODE_ENV !== 'production'
});

// nasSchema.path('login').required(true);
// nasSchema.path('assets').required(true);

mongoose.model('NAS', nasSchema);
