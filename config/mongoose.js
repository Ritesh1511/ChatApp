// require the library
const mongoose = require('mongoose');

// connect to the database
// mongoose.connect('mongodb+srv://admin:devilshivang@chat-app.rnfa4.mongodb.net/chat-app?retryWrites=true&w=majority',{
//     useUnifiedTopology:true
// });

mongoose.connect('mongodb://localhost/chat_app_db');

// getting access to the database
const db = mongoose.connection;

// on getting error
db.on('error', console.error.bind(console, 'Error connecting on Database'));

// up and running then print the message
db.once('open', () => {
    console.log("Successfully connecting to database");
});

module.exports = db;