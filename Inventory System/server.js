const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/inventory', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const inventoryRoutes = require('./routes/inventory');
app.use('/api/inventory', inventoryRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
