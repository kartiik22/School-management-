const express = require('express');
const connect = require('../db'); // Import the MongoDB connection
const router = express.Router();

// Add School API
router.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = await connect(); // Get the database instance
        const schools = db.collection('schools'); // Access the 'schools' collection

        // Insert a new school
        const result = await schools.insertOne({ name, address, latitude, longitude });
        res.status(201).json({ message: 'School added successfully', id: result.insertedId });
    } catch (err) {
        console.error('Error adding school:', err);
        res.status(500).json({ error: 'Failed to add school' });
    }
});

// List Schools API
router.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    // Validate input
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const db = await connect(); // Get the database instance
        const schools = db.collection('schools'); // Access the 'schools' collection

        // Fetch all schools
        const allSchools = await schools.find().toArray();

        // Calculate distances and sort by proximity
        const schoolsWithDistance = allSchools.map(school => {
            const distance = calculateDistance(latitude, longitude, school.latitude, school.longitude);
            return { ...school, distance };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.status(200).json(schoolsWithDistance);
    } catch (err) {
        console.error('Error fetching schools:', err);
        res.status(500).json({ error: 'Failed to fetch schools' });
    }
});

// Helper function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

module.exports = router;