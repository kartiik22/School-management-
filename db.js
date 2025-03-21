const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'pti1i.h.filess.io',
    port: 61002, 
    user: 'schoolapiclone_belonghas', 
    password: 'b5e8146be86ab1004c32f5ad564d13c25a25c24e', 
    database: 'schoolapiclone_belonghas'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err);
    } else {
        console.log('✅ Connected to MySQL database');

        // Check if the table exists
        db.query("SHOW TABLES LIKE 'schools'", (err, results) => {
            if (err) {
                console.error("❌ Error checking tables:", err);
            } else if (results.length === 0) {
                console.log("⚠️ Table 'schools' does NOT exist. Creating it now...");
                db.query(`
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
                });
            } else {
                console.log("✅ Table 'schools' already exists.");
            }
        });
    }
});

module.exports = db;
