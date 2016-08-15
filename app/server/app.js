// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;

// mongoose
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/mean-auth-master(1)';
mongoose.connect(mongoUri);

// user schema/model
var User = require('./models/user.js');
var Deck = require('./models/deck.js');

// create instance of express
var app = express();
var routes = require('./routes/api.js');

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', routes);
app.post('/deckbuilder', Deck.create);
app.get('/profile/:name', Deck.find);
app.delete('/profile/:id', Deck.delete);
app.get('/deckbuilder/edit/:id', Deck.edit);
app.put('/deckbuilder/edit/:id', Deck.update);

// error handlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on: " + port);
});