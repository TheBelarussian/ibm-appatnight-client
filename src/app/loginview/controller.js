angular.module('app').controller('loginviewCtrl', [
'$scope','nameservice', 'socket', '$state',
function($scope, nameservice, socket, $state) {
    $scope.login = function () {
        nameservice.save(form.name);
        socket.emit('login', { user: 'Wlad Meixner' }).on(function() {
        	$state.go('mainview');
        });
    };
}]);
