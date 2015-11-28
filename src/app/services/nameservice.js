/**
 * Created by Bubble on 28.11.2015.
 */
angular.module('app')
    .factory('nameservice', function(){

        var userName;
        var service = {};

        service.save = function(user){
            userName = user;
        };
        service.load = function(){
            return user;
        };

        return service;

    });
