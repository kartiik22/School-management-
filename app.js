const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', schoolRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});