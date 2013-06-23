'use strict';

/* Controllers */
function LlapCtrl($scope, socket) {
    $scope.nodes = [ 
        { id: "DH", type: "TMP", value: "0" },
        { id: "DH", type: "HUM", value: "0" }
    ];
      
    // fetch all current nodes from server at startup
    /*$http.get('leds').success(function(data) {
        $scope.nodes = data;
    }); */
    $scope.graphData = [];
    /*xaxis: {
        mode: 'time',
        timeformat: '%M:%S'
    },
    colors: ['#049cdb']
    $scope.plot = $.plot('#graph', [], {
            series: { shadowSize: 0 }, // drawing is faster without shadows
            yaxis: { min: 0, max: 100 },
			xaxis: {
				show: false
			}
		});
    */
    var chart = null,
       opts  = { };

    $scope.$watch(attrs.ngModel, function(v){
        if(!chart){
            chart = $.plot(elem, v , opts);
            elem.show();
        }else{
            chart.setData(v);
            chart.setupGrid();
            chart.draw();
        }
    });
    
    $scope.getNodes = function() {
        socket.emit("get:nodes", {});
    }
  
    $scope.stopAnimation = function() {
        socket.emit("stopAnimation", {});
    }
    
    // handle incoming change events
    socket.on('connect', function() {
        console.log('Server connected.');
    });
    
    socket.on('disconnect', function () {
        console.log('Server disconnected.');
    });
    
    socket.on("nodes:all", function(data) {
        console.log('Got node data '+data);
        $scope.nodes = data;
        if (data.id == 'DH' && data.type == 'HUM') {
            //$scope.graphData.push([data.lastUpdate, data.value]);
            if ($scope.graphData.length > 0)
                $scope.graphData = $scope.graphData.slice(1);
                
            $scope.graphData.push(data.value);
            // Zip the generated y values with the x values            
            var res = [];
			for (var i = 0; i < $scope.graphData.length; ++i) {
				res.push([i, $scope.graphData[i]]);
			}
            $scope.graphData = res;
            //$scope.plot.setData([$scope.graphData]);
            //$scope.plot.draw();
        }
    });

    socket.on("nodes:update", function(data) {
        for (var i=0; i<data.length; i++) {
            if ($scope.nodes[data[i].id].type === data[i].type) {
                // Update existing value
                $scope.nodes[data[i].id].value = data[i].value;
                $scope.nodes[data[i].id].lastUpdate = data[i].lastUpdate;
            } else {
                // Add new node
                $scope.nodes.push(data[i]);
            }
        }
    });
}
/*
// constructor always takes the id
function graphdisplay(id, key, wsclient) {
    this.domobj = $('#' + id + ' > div');
    this.data_counter = 0;
    // buffer stored in ms
    this.time_len = 10000;
    this.update_interval = 40;
    this.data = [];
    this.data_len = parseInt(this.time_len / this.update_interval);
    this.last_data_point = 0;

    this.no_data = true;

    this.stop_timer = false;

    var options = {
        series: { shadowSize: 0 }, // drawing is faster without shadows
        //yaxis: { min: 0, max: 100 },
        xaxis: {
            mode: 'time',
            timeformat: '%M:%S'
        },
        colors: ['#049cdb']
    };
    this.plot = $.plot(this.domobj, [], options);
}

graphdisplay.prototype.timer = function() {
    if (this.stop_timer)
    {
        clearInterval(this.interval);
        return;
    }

    var t = Date.now();

    if (this.data.length >= this.data_len)
        this.data = this.data.slice(1);

    this.data.push([t, this.last_data_point]);
    this.plot.setData([this.data]);
    this.plot.setupGrid();
    this.plot.draw();
};

graphdisplay.prototype.update = function(value) {
    this.last_data_point = value;
    var self = this;

    if (this.no_data) {
        this.no_data = false;
        this.timer();
        this.interval = setInterval(function(){
            self.timer();
        }, this.update_interval);
    }
};

graphdisplay.prototype.close = function() {
    // this doesn't seem to work...
    // function is called but Flot later throws an exception
    this.stop_timer = true;
    this.plot.shutdown();
};*/
app.controller('TestCtrl', function ($scope, socket) {
    $scope.command = "aDHHELLO----";
    
    $scope.send = function() {
        // TODO: validate llap
        socket.emit("send", {message: $scope.command});
    };
    
    socket.on("message", function(data) {
        $scope.log = $scope.log + data;
    });
    
});

app.controller('NavbarCtrl', function ($scope, $location) {
    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) == path) {
            return true;
        } else {
            return false;
        }
    };
});