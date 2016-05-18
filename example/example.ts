import '../src/tnx-dialog';
import {MainController} from "./MainController";

angular.module('app',[
    'tnx.dialog'
])
.controller('MainController', MainController);

