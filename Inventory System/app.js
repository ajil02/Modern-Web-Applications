require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const url = process.env.MONGODB_URI;
const dbName = new URL(url).pathname.substring(1);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/add', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('inventory');
        const newItem = { name: req.body.name, quantity: parseInt(req.body.quantity) };
        const result = await collection.insertOne(newItem);
        await client.close();
        res.send(`Item added with ID: ${result.insertedId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('inventory');
        const filter = { _id: new ObjectId(req.body.id) };
        const update = { $set: { name: req.body.name, quantity: parseInt(req.body.quantity) } };
        const result = await collection.updateOne(filter, update);
        await client.close();
        res.send(`Updated ${result.modifiedCount} item(s)`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/delete', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('inventory');
        const result = await collection.deleteOne({ _id: new ObjectId(req.body.id) });
        await client.close();
        res.send(`Deleted ${result.deletedCount} item(s)`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/items', async (req, res) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('inventory');
        const items = await collection.find({}).toArray();
        await client.close();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
