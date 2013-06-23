'use strict';

//var app = angular.module('app', ['teTouchevents']).
var app = angular.module('app', ['ui.bootstrap']);

//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
            {
                controller: 'LlapCtrl',
                templateUrl: '/app/partials/main.html'
            })
        //Define a route that has a route parameter in it (:customerID)
        /*.when('/customerorders/:customerID',
            {
                controller: 'CustomerOrdersController',
                templateUrl: '/app/partials/customerOrders.html'
            })*/
        .when('/testing',
            {
                controller: 'TestCtrl',
                templateUrl: '/app/partials/testing.html'
            })
        .otherwise({ redirectTo: '/' });
});

app.factory('socket', function ($rootScope) {
    console.log("socket factory");
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
/*
app.directive('chart', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            var data = scope[attrs.ngModel];
            $.plot(elem, data, {});
            elem.show();
        }
    };
});*/