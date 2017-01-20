'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({

    code: { type: String, required: true, index: true },
    name: String,

    login: Schema.Types.Mixed,
    // sample format:
    // { enabled: true, email: true, facebook: true, google: true, ... }

    assests: {
        logo: String,
        url: String,
        background: String,
        slogan: String
    }

}, {
    versionKey: false,
    collection: 'companies',
    autoIndex: process.env.NODE_ENV !== 'production'
});

mongoose.model('Companies', companySchema);
