const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const trackingSchema = new mongoose.Schema({
    exception: String
});

const Tracking = mongoose.model('Tracking', trackingSchema);

app.use(express.json());

// POST endpoint to save tracking data
app.post('/exceptions', async (req, res) => {
    try {
        const { exception } = req.body;
        const tracking = new Tracking({ exception });
        await tracking.save();
        res.status(201).json({ message: 'Exception saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save exception data' });
    }
});

// GET endpoint to retrieve all tracking data
app.get('/exceptions', async (req, res) => {
    try {
        const allTracking = await Tracking.find();
        res.json(allTracking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve exceptions data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
