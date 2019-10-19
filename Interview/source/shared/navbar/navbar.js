'use strict';

angular.module('appInterview').
component('navbar', {
    templateUrl: './source/shared/navbar/navbar.html',
    controller: function NavbarController() {
        let vm = this;
    },
    restrict: 'E',
    bindings: {
        active: '@'
    },
    controllerAs: 'vm'
});