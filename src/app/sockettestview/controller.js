angular.module('app').controller('socketTestCtrl', [
'$scope',
'socket',
function($scope, socket) {
    $scope.testing = "HELLO";

    socket.on("connection", function(data) {
        console.log("connected: " + data);
    });
}]);
