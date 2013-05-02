//var server = require("./server.js");
//var router = require("./router.js");
var handlers = require("./handlers.js");
var sockets = require("./sockets.js");
var express = require('express');
var app = express();
// Express Static Middleware Cache-Control
var oneDay = 86400000;

// New call to compress content
app.use(express.compress());

app.use(express.static(__dirname + '/static'));
//app.use(express.static(__dirname + '/static', { maxAge: oneDay }));

app.listen(process.env.PORT || 8888);

var handler = {};
handler["/leds"] = handlers.leds;

//server.start(router.routeHttp, handler);
//sockets.start(server.app, handlers.handleSocket);
sockets.start(app, handlers.handleSocket);