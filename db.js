const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb+srv://kartik:G8f$%409mXz!Qp21B@cluster0.5dfgu.mongodb.net/school_management';

// Create a MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
async function connect() {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        return client.db('school_management'); // Return the database instance
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1); // Exit the application if connection fails
    }
}

module.exports = connect;