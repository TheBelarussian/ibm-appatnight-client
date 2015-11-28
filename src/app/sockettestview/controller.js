angular.module('app').controller('socketTestCtrl', [
'$scope',
'socket',
'microphone',
function($scope, socket, microphone) {

    microphone.init();

    $scope.record = function() {
        microphone.record()
    };

    $scope.stop = function() {
        microphone.stop()
    };

    $scope.testing = "HELLO";

    socket.on("connection", function(data) {
        $scope.text = data.text;
    });
}]);
