'use strict';

angular.module('appInterview').controller('BugFilledCtrl', [
	'$scope',
	function(
		$scope
	) {

		$scope.count = 0;

		$scope.observableObject = {
			text: 'hello',
			textB: 'world'
		};

		$scope.changedCounter = function () {
			$scope.count = $scope.count + 1;
		};

		$scope.$watch('observableObject', function(newValue, oldValue) {
			if (newValue !== oldValue) {
				$scope.changedCounter++;
			}
		});
	}
]);