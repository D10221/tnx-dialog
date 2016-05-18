class MainController{

    static $inject =['$scope'];

    message = 'Hellow';

    constructor($scope) {

    }
}
angular.module('app',[])
    .controller('MainController', MainController);

