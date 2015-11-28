angular.module('app').controller('socketTestCtrl', [
'$scope',
'socket',
'microphone',
function($scope, socket, microphone) {

microphone.init();
microphone.record();




    $scope.testing = "HELLO";

    socket.on("connection", function(data) {
        $scope.text = data.text;
    });
}]);
