angular.module('app').controller('mainviewCtrl', [
	'$scope',
	function($scope) {
	}
]);

angular.module('app').controller('mainviewRecordButtonController', [
	'$scope',
	function($scope) {
		activateRecordButton();
	}
]);

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
