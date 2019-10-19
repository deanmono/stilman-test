
let mainApp = angular.module('appInterview', [
	'ngRoute',
	'ngAnimate',
	'ui.bootstrap',
	'nemLogging',
	'ui-leaflet',
	'rzSlider'
]).config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'source/home/home.html',
			controller: 'HomeCtrl'
		}).when('/bugfilled', {
			templateUrl: 'source/bugfilled/bugFilled.html',
			controller: 'BugFilledCtrl'
		}).when('/feature', {
			templateUrl: 'source/feature/feature.html',
			controller: 'FeatureCtrl'
		})
}]).constant('_', window._);