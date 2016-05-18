import IDirectiveFactory = angular.IDirectiveFactory;
import IScope = angular.IScope;


import Subject = Rx.Subject;
import Disposable = Rx.Disposable;
import {HTMLDialogElement} from "./HTMLDialogElement";
import {DialogCtrl} from "./DialogCtrl";
import {DialogDirectiveScope} from "./interfaces";


declare var componentHandler : { upgradeElements : (x:any)=> void };


angular.module('tnx.dialog', [])
    .controller('DialogCtrl', DialogCtrl)
    /***
     *  IN context dialog
     */
    .directive('tnxDialog', ()=> {
        return {
            restrict: 'E',
            controller: 'DialogCtrl',
            controllerAs: 'vm',
            templateUrl: function (element, attr) {
                return attr.templateUrl || "./";
            },
            scope: /*<DialogCtrlScope>*/{
                /***
                 * Sender as IObservableThing
                 */
                owner: "=",
                /***
                 * Dialog Options
                 */
                header: "=",

                commands: '=',

                xid: '='
            },
            compile: ()=> {
                return {
                    pre: (scope:DialogDirectiveScope, element:ng.IAugmentedJQuery, attr:ng.IAttributes) => {

                        var dialog = element.find('dialog')[0];

                        if (dialog) {
                            componentHandler.upgradeElements(dialog);
                        }

                        if (scope.vm) {
                            scope.vm.dialog = dialog as HTMLDialogElement;
                        }
                    }
                }
            },
            transclude: true
        }
    });
