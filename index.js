const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const User = require('./models/user');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded());

app.use(cookieParser());

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static(path.join(__dirname, '/static')));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'chat app session',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/chat_app_db'
        },
        function (err) {
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session())
app.use(passport.setAuthenticatedUser);

app.get('/', (req, res) => {
    if(req.isAuthenticated()){
        return res.render('chat');
    }
    return res.render('user_sign_in.ejs');
})

app.get('/signin', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('user_sign_in.ejs');
})

app.get('/signup', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('user_sign_up.ejs');
})

app.post('/create-user', (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        console.log('password does not match')
        return res.redirect("back");
    }
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return console.log('Error on finding user on database');
        }
        if (!user) {
            User.create(req.body, (err, data) => {
                if (err) {
                    console.log('Error on creating new contact', err);
                    return res.redirect("back");
                }
                console.log('Successfully created user');
                return res.redirect('/signin');
            })
        }
        else {
            console.log('User is already created');
            return res.redirect("back");
        }
    })
})

app.post('/create-session', passport.authenticate(
    'local',
    //telling passport to use local strategy 

    { failureRedirect: '/signin' }
    // if authentication is failed it will redirect to given sign in page
), (req, res) => {
    return res.redirect('/');
})

app.get('/signout', (req, res) => {
    req.logout();
    return res.redirect('/signin');
});


const server = app.listen(PORT, (err) => {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running up and running on ${PORT} port`);
});


const io = require('socket.io')(server);

const users = {};

io.on('connection', (socket) => {
    console.log('Connected...');

    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });

    socket.on('send-message', message => {
        console.log(users);
        socket.broadcast.emit('recieve', {
            message,
            name: users[socket.id]
        })
    });

    socket.on('leave', () => {
        console.log("name");
        socket.broadcast.emit('user-leave', {
            name: users[socket.id],
        })
    })

})
