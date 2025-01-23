//Vou usar esse cod pra salvar a session no Mongo

// >>>> npm install connect-mongodb-session

/*
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Configure the store
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/your_database', // Replace with your MongoDB URI
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
});

// Handle store errors
store.on('error', function(error) {
    console.log('Session store error:', error);
});

// Configure session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
        secure: false, // Set to true if using HTTPS
        httpOnly: true
    }
}));
*/


/// If you're using MongoDB Atlas or a different MongoDB host, modify the URI accordingly:
//const uri = 'mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority';


//Make sure your MongoDB connection is established before setting up the session
//const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/your_database')
//    .then(() => console.log('MongoDB connected'))
//    .catch(err => console.log('MongoDB connection error:', err));


