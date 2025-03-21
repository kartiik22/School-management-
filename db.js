const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'c5lnu.h.filess.io',
    port: 61002,
    user: 'a_askrestdry',
    password: 'ffa0eacbc6d2a42d1ddd2da4ae3d9a830c8aaa62',
    database: 'a_askrestdry',
    waitForConnections: true, // Wait for a connection if none are available
    connectionLimit: 3000, // Reduce the pool size to 3
    queueLimit: 0 // Unlimited queueing for connection requests

});

// Get a connection from the pool and check/create the 'schools' table
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error getting connection from pool:', err);
        return;
    }

    console.log('✅ Connected to MySQL database');

    // Check if the 'schools' table exists
    connection.query("SHOW TABLES LIKE 'schools'", (err, results) => {
        if (err) {
            console.error("❌ Error checking tables:", err);
            connection.release(); // Release the connection back to the pool
            return;
        }

        if (results.length === 0) {
            console.log("⚠️ Table 'schools' does NOT exist. Creating it now...");

            // Create the 'schools' table
            connection.query(`
                CREATE TABLE schools (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    address VARCHAR(255) NOT NULL,
                    latitude DECIMAL(10, 8) NOT NULL,
                    longitude DECIMAL(11, 8) NOT NULL
                )
            `, (err) => {
                if (err) {
                    console.error("❌ Error creating table:", err);
                } else {
                    console.log("✅ Table 'schools' created successfully.");
                }
                connection.release(); // Release the connection back to the pool
            });
        } else {
            console.log("✅ Table 'schools' already exists.");
            connection.release(); // Release the connection back to the pool
        }
    });
});

// Export the pool for use in other files
module.exports = pool.promise(); // Use promise() for async/await support