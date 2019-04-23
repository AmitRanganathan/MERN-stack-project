// Create the Express server
// Initialize other variables
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;

// Attaching the cors and body-parser middleware
app.use(cors());
app.use(bodyParser.json());

// Make serevr listen on port 4000
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
})