const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    status: { type: String, required: [true, 'Status field is required'], enum: ['YES', 'NO', 'MAYBE'] },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true},
}, { timestamps: true });

module.exports = mongoose.model('Rsvp', rsvpSchema);
