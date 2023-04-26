
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/codeial_development');

const db = mongoose.connection;

db.on('error',console.error.bind(console, "Error Connecting to MongoDB...."));

db.once('open', function(){
    console.log('Connected to DataBase :: MongoDB');
});

//to make this file usable we need to export it
module.exports = db;