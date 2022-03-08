const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

// authentication using passport
// setting local stratergy to passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    (req, email, password, done) => {
        // finding a user
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                req.flash('error', err);
                return done(err);
            }

            if (!user || user.password != password) {
                return done(null, false);
                // here false parameter show authentication is not done
            }

            return done(null, user);
            // here null indicates no error
        })
    }
));

// serializing/encrypting the user to decide which key is to be kept in the cookies 
// this funtion is used to save the user key in cookie in encrypting form
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// deserializing/unencrypting the user from the key in the cookies when user signing in
// unencrypting and search for user in database and show content acc to user when browser makes a request
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) {
            console.log('Error in finding user for deserializing');
            return done(err);
        }
        done(null, user);
    })
})

// check if the user is authenticated
passport.checkAuthentication = (req, res, next) => {
    // if the user is signed in, then pass on the requestto the next function(controler's action)
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not signed in
    return res.redirect('/signin');
}

passport.setAuthenticatedUser = (req, res, next) => {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;