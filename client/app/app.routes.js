(function() {
	'use strict';
	
	angular.module('app.routes', ['ngRoute','ui.router'])

	.config(function( $stateProvider, $urlRouterProvider, $locationProvider) {

		$urlRouterProvider.otherwise("/");
		$locationProvider.html5Mode(true);

	});

})();