const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: String,
  preferences: String,
  slot: Number
});

module.exports = mongoose.model('Participant', participantSchema);
