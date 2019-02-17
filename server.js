const express = require('express');
const mongoose = require('mongoose');

const app = express();

// db config

const db = require('./config/keys').mongoURI;

app.get('/', (req, res) => {
    res.send('I am from server...');
})

mongoose
    .connect(db)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));