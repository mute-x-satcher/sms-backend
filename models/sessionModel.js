const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({

    name:{
      type: String,
      default: 'whatsapp_js_session',
    },
    sessionData:{
      type: Buffer,
      required: true
    }

},{timestamps: true});

const sessionModel = mongoose.model('session', SessionSchema);

module.exports = sessionModel