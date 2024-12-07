const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for the first HTML file (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the second HTML file (index2.html)
app.get('/index2', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

// Start the server 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});