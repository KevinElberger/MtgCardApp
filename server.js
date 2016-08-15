#!/usr/bin/env node

// var debug = require('debug')('passport-mongo');
var app = require('./app');

// app.set('port', 27017);

// var server = app.listen(app.get('port'), function() {
//   debug('Express server listening on port ' + server.address().port);
// });

var server = app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});