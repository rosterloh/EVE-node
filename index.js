var express = require('express')
//  , routes = require('./routes')
  , http = require('http');
 
var app = express();
var server = app.listen(8888);
var io = require('socket.io')
    , handlers = require('./handlers.js');

//io.set('log level', 1);  
//console.log("socket started ...");
io = io.listen(server);
io.sockets.on("connection", handlers.handleSocket );

app.configure(function(){
    //app.set('views', __dirname + '/views');
    //app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    //app.use(express.compress());
    app.use(express.static(__dirname + '/static'));
    // Express Static Middleware Cache-Control
    //var oneDay = 86400000;
    //app.use(express.static(__dirname + '/static', { maxAge: oneDay }));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});
 
app.configure('development', function(){
  app.use(express.errorHandler());
});
 
//app.get('/', routes.index); 
 
console.log("Express server listening on port 8888");
