const express = require('express');
const db = require('../db');
const router = express.Router();

// Add School API
router.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.error('Error adding school:', err);
            return res.status(500).json({ error: 'Failed to add school' });
        }
        res.status(201).json({ message: 'School added successfully', id: result.insertId });
    });
});

// List Schools API
router.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;

    // Validate input
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const query = `
        SELECT id, name, address, latitude, longitude,
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
        FROM schools
        ORDER BY distance
    `;
    db.query(query, [latitude, longitude, latitude], (err, results) => {
        if (err) {
            console.error('Error fetching schools:', err);
            return res.status(500).json({ error: 'Failed to fetch schools' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;