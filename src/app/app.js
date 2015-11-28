// Create the shop module and name it.
// Also include ngRoute for all our routing needs
angular.module('app', [
    'ui.router',
    'ui.bootstrap'
]);

angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to the root.
    $urlRouterProvider.otherwise("/");

    // Now set up the routes
        $routeProvider
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'loginview/login.html'
            })

            .when('/', {
                controller  : 'mainviewCtrl',
                templateUrl: 'modules/home/views/home.html'
            })

            .otherwise({ redirectTo: '/login' });

});

angular.module('app').run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);
