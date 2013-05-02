//var server = require("./server.js");
//var router = require("./router.js");
var handlers = require("./handlers.js");
var sockets = require("./sockets.js");
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

app.listen(process.env.PORT || 8888);

var handler = {};
handler["/leds"] = handlers.leds;

server.start(router.routeHttp, handler);
sockets.start(server.app, handlers.handleSocket);