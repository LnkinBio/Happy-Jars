var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var router = express.Router();

/* Models */

var User = require('../models/user');


/* Passport local auth strategy */

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
   	  if(err) throw err;
   	  if(!user){
   		   return done(null, false, {message: 'Unknown User'});
   	  }

     	User.comparePassword(password, user.password, function(err, isMatch){
     		if(err) throw err;
     		if(isMatch){
     			return done(null, user);
     		} else {
     			return done(null, false, {message: 'Invalid password'});
     		}
     	});
   });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
   	  if(err) throw err;
   	  if(!user){
   		   return done(null, false, {message: 'Unknown User'});
   	  }

     	User.comparePassword(password, user.password, function(err, isMatch){
     		if(err) throw err;
     		if(isMatch){
     			return done(null, user);
     		} else {
     			return done(null, false, {message: 'Invalid password'});
     		}
     	});
   });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


/* Default route, when person tries to open localhost/auth/ 
it'll redirect to /auth/login and /auth is invalid route. */

router.get('/', function(req, res, next) {
	res.redirect("/auth/login")
    next
});


/* Display registeration page */

router.get('/register', function(req, res, next) {
	res.render('register', {title: '.:: Register - Happy Jars ::.' })
});


/* Post Register Data */
router.post('/register', function(req, res, next){
  var password = req.body.password;
  var password2 = req.body.password2;

  if (password == password2){
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      res.send(user).end()
    });
  } else{
    res.status(500).send("Password Doesn't Match!").end()
  }
});


/* Display login page */

router.get('/login', function(req, res, next) {
  res.render('login', { title: '.:: Login - Happy Jars ::.' });
});

/* Post Login data */

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.send(req.user);
  }
);

/* Logout! It is also important right? */

router.get('/logout', function(req, res){
	req.logout();
	res.redirect("/auth/login")
});


/* Facebook Auth */

passport.use(new FacebookStrategy({
    clientID: "#",
    clientSecret: "#",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
      if (err) return done(err);
      if (user) return done(null, user);
      else {
        // if there is no user found with that facebook id, create them
        var newUser = new User();

        // set all of the facebook information in our user model
        newUser.facebook.id = profile.id;
        newUser.facebook.token = accessToken;
        newUser.facebook.name  = profile.displayName;
        if (typeof profile.emails != 'undefined' && profile.emails.length > 0)
          newUser.facebook.email = profile.emails[0].value;

        // save our user to the database
        newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
        });
      }
    });
  }
));

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook',{
	failureRedirect: '/auth/login'
}),
  function(req, res) {
    // Successful authentication
    console.log(req.user)
    res.redirect('/');
  }
);



module.exports = router;
