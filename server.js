const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// MongoDB Atlas connection string
const mongoDBAtlasConnectionString = 'mongodb+srv://Cluster23376:Kupasmierdzi1@secretsanta.8bfzhm1.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoDBAtlasConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas...'))
  .catch(err => console.error('Could not connect to MongoDB Atlas...', err));

app.use(express.json()); // for parsing application/json

const Participant = require('./participant'); // Import the Participant model

// GET route to fetch participants
app.get('/api/participants', async (req, res) => {
  try {
    const participants = await Participant.find();
    res.send(participants);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST route to add a new participant
app.post('/api/participants', async (req, res) => {
  const participant = new Participant({
    name: req.body.name,
    preferences: req.body.preferences,
    slot: req.body.slot
  });

  try {
    const savedParticipant = await participant.save();
    res.send(savedParticipant);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


// Define your routes and middleware here

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
