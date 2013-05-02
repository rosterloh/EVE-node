var express = require('express')
  , routes = require('./routes')
  , http = require('http');
 
var app = express();
var server = app.listen(8888);
var io = require('socket.io').listen(server);
 
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
/*
//var server = require("./server.js");
//var router = require("./router.js");
var handlers = require("./handlers.js");
//var sockets = require("./sockets.js");
var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
  


app.use(express.static(__dirname + '/static'));


app.listen(process.env.PORT || 8888);

io.set('log level', 1);  
io.sockets.on("connection", handlers.handleSocket );
console.log("socket started ...");
server.listen(3000);
*/
//var handler = {};
//handler["/leds"] = handlers.leds;

//server.start(router.routeHttp, handler);
//sockets.start(server.app, handlers.handleSocket);
