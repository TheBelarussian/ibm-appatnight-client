angular.module('app').controller('mainviewCtrl', [
'$scope',
function($scope) {
    console.log("hello I am the main view" );
    $scope.lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
}]);

// Session controller
angular.module('app').controller('mainviewSessionCtrl', [
	'$scope', function($scope) {
		$scope.users = [
			{ name: 'Kevin' },
			{ name: 'Moritz' },
			{ name: 'Daniel' },
			{ name: 'Wlad' },
		];
		$scope.info = {
			name: 'Press Conference',
			date: 'Sat 28 Nov, 2015',
			startingTime: '12:54'
		};
	}
]);

// Protocol controller
angular.module('app').controller('mainviewProtocolCtrl', [
	'$scope', function($scope) {
		$scope.protocol = [
			{ 
				user: 'Daniel',
				messages: [
					{ time: '13:55.44', message: 'Hello and welcome to the IBM track.' },
				]
			},
			{ 
				user: 'Kevin',
				messages: [ 
					{ time: '13:56.23', message: 'Booooo!' },
					{ time: '13:56.27', message: 'Get off the stage!' }
				]
			},
		];
	}
]);

// Meta controller
angular.module('app').controller('mainviewMetaCtrl', [
	'$scope', function($scope) {
		$scope.keywords = [
			{text: "Lorem", weight: 13},
			{text: "Ipsum", weight: 10.5},
			{text: "Dolor", weight: 9.4},
			{text: "Sit", weight: 8},
			{text: "Amet", weight: 6.2},
			{text: "Consectetur", weight: 5},
			{text: "Adipiscing", weight: 5},
			/* ... */
		];
		$("#keyword-cloud").jQCloud($scope.keywords, {
			width: 500,
			height: 300
		});
	}
]);
