var lhelper = require('./llap_helper');
var com = require("serialport");

function Reading(id, type, value) {
    this.id = id;
    this.type = type;
    this.value = value;
    this.lastUpdate = new Date();
    this.timestamp = function() {
        this.lastUpdate = new Date();
    };
    this.announce = function() {
        //var year = this.lastUpdate.getFullYear();
        //var month = this.lastUpdate.getMonth()+1;
        //var date = this.lastUpdate.getDate();
        //var hour = this.lastUpdate.getHours();
        //var minutes = this.lastUpdate.getMinutes();
        //var seconds = this.lastUpdate.getSeconds();
        //var time = year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+seconds;
        //console.log(time+': New '+this.type+' reading from '+this.id+' of '+this.value);
        console.log(this.lastUpdate.toString()+': New '+this.type+' reading from '+this.id+' of '+this.value);
    }
}

//var nodes = {};
var nodes = [];
function updateNodes(data) {
    if (nodes.length === 0) {
        nodes.push(data);
        console.log('New Node detected: '+data.id+' '+data.type+', Total Nodes:['+nodes.length+']');
    } else {
        var found = false;
        var i = 0;
        while(!found) {
            if ((nodes[i].id == data.id) && (nodes[i].type == data.type)) {
                nodes[i].value = data.value;
                //nodes[i].timestamp();
                nodes[i].lastUpdate = new Date();
                found = true;
            } else {
                i++;
            }
            if (i == nodes.length) {
                nodes.push(data);
                console.log('New Node detected: '+data.id+' '+data.type+', Total Nodes:['+nodes.length+']');
                found = true;
            }
        }        
        // .filter  Creates a new array with all elements that pass the test implemented by the provided function.
        // .map     Creates a new array with the results of calling a provided function on every element in this array.
        // .reduce  Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value.
        /*
        var filtered = nodes.filter(function (element, index, array) {
            return ((data.id == element.id) && (data.type == element.type))
        });
        if (filtered.length > 0) {
            for (var i=0; i<nodes.length; i++) {
               if ((nodes[i].id == data.id) && (nodes[i].type == data.type)) {
                nodes[i].value = data.value;
                nodes[i].timestamp();
               }
            }
        } else {
            nodes.push(data);
            console.log('New Node detected: '+data.id+' '+data.type+', Total Nodes:['+nodes.length+']');
        }
        */
    }
}

var incomingData = "";
var llapParser = function(emitter, buffer){
    incomingData += buffer.toString();
    // remove any stuff before a signature 'a' appears
	incomingData = incomingData.replace(/^[^]*?a/,'a');
	while (incomingData.length >= 12) {
		emitter.emit('data',incomingData.substr(0,12));
        incomingData = incomingData.substr(12).replace(/^[^]*?a/,'a');
	}
}
var port = "/dev/ttySRF0";
var serialPort = new com.SerialPort(port, {
    baudrate: 9600,
    parser: llapParser
    //parser: com.parsers.raw
});

serialPort.on('open',function() {
  console.log('Port on '+port+' open');
});

serialPort.on('data', function(data) {
    var msg = data.toString();
    // process data received
    if (lhelper.isValid(msg)) {
        var reading = {
            id: msg.substring(1,3),
            type: msg.substring(3,6),
            value: msg.substring(6,12).replace(/-/g, ''),
            lastUpdate: new Date()
        };        
        //var reading = new Reading(msg.substring(1,3), msg.substring(3,6), msg.substring(6,12).replace(/-/g, ''));
        //reading.announce();
        //console.log(reading.type+' value of '+reading.value+' received from '+reading.id+' at '+reading.lastUpdate.toString());
        // let all the clients know about the message
        //sockets.emit('data:received', reading);
        updateNodes(reading);
        //console.log(nodes);
    } else {
        // message not valid
        console.log('Invalid message received. ['+msg+']');
    }
});

// send current nodes as json
function renderNodes(request, response) {
  response.writeHead(200, {"Content-Type": "application/json"});
  response.write(JSON.stringify(nodes));
  response.end();
}

// handle socket events
function handleSocket(socket) {
    socket.on("get:nodes", function(data) {
        socket.emit("nodes:all", nodes);
    });
    socket.on("change:led", function(data) {
        //changeLed(socket, data);
    });
    socket.on("startAnimation", function(data) {
        //startAnimation(socket, leds);
    });
    socket.on("stopAnimation", function(data) {
        //stopAnimation(socket);
    });
}

exports.nodes = renderNodes;
exports.handleSocket = handleSocket;