const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//== local strategy ==//
//** local strategy is using during Log In for checking email and password (with existing emails and passwords in db) 

// Setup options for local startegy
const localOptions = { usernameField: 'email' };
// Create local strategy
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  // Verify this email and password, 
  // if it is the correct email and password => call done with the user
  // otherwise, call done with false
  User.findOne({ email: email }, function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare password - is `password` equal to user.password ?
    user.comparePassword(password, function (err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    })
  })
});


//== JWT strategy ==//
//** JWT strategy is using during any get-requsts with token (after already Signed Up or Loged In) for checking token 
// (compare id from token with existing id_s in db)

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise call 'done' without an user object
  User.findById(payload.sub, function (err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this stretegy
passport.use(jwtLogin);
passport.use(localLogin);
