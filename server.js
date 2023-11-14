const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Replace with your MongoDB URI
const mongoUri = 'mongodb+srv://Cluster23376:Kupasmierdzi1@secretsanta.8bfzhm1.mongodb.net/?retryWrites=true&w=majority';

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/api/participants', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db("secretsanta").collection("participants");
        const participants = await collection.find({}).toArray();
        res.json(participants);
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});

app.post('/api/participants', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db("secretsanta").collection("participants");
        const result = await collection.insertOne(req.body);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(500).send(error.message);
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
