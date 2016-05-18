import IDirectiveFactory = angular.IDirectiveFactory;
import IScope = angular.IScope;
import {IObservableController} from "tnx-core";


import Subject = Rx.Subject;
import Disposable = Rx.Disposable;
import {HTMLDialogElement} from "./HTMLDialogElement";


declare var componentHandler : { upgradeElements : (x:any)=> void };

export interface DialogOptions {

    xid?:string;

    header?:any ;

    commands?:IDialogCommand[];

}

interface DialogCtrlScope extends IScope, DialogOptions {

    owner:IObservableController;
}

export interface IDialogCommand {
    /***
     * takes: owner: as parent controller , returns dialog canClose
     */
    exec:(x?:any) => boolean;
    canExec?:(x?:any) => boolean;
    text:string;
}

class DialogCtrl implements Disposable {

    constructor($scope:DialogCtrlScope) {

        this.mergeOptions($scope);

        if ($scope.owner) {

            var xEvents = $scope.owner.xEvents.asObservable();

            this.disposables.add(
                xEvents
                    .where(e=>e.sender != this)
                    .where(e=> e.args.value.idx == this.options.xid)
                    .where(e=> e.args.key == 'show')
                    .subscribe(this.show)
            );

            this.disposables.add(
                xEvents
                    .where(e=> e.sender != this)
                    .where(e=> e.args.value.idx == this.options.xid)
                    .where(e=> e.args.key == 'close')
                    .subscribe(e=> this.close(null))
            );
        }

        this.runCommand = (c:IDialogCommand) => {

            c.canExec = c.canExec || (x=>true);

            if (c.canExec($scope.owner)) {

                var close = c.exec(this);

                if (close) {
                    this.close(null)
                }
            }
        };

        $scope.$on('$destroy', () => {
            console.log('DialogCtrl disposing');
            // watcherDispose();
            this.dispose();
        });
    }

    get header():any {
        return this.options && this.options.header ? this.options.header : null;
    }

    runCommand:(c:IDialogCommand) => void;

    dialog:HTMLDialogElement;

    options:DialogOptions = {};

    static $inject = ['$scope'];

    disposables = new Rx.CompositeDisposable();

    dispose() {
        this.disposables.dispose();
    }

    show:(e?)=> void = (e) => {

        this.mergeOptions(e.args.value);

        if (this.dialog) {
            this.dialog.showModal();
        }
    };

    close:(e?)=> void = (e)=> {
        if (this.dialog) {
            this.dialog.close();
            this.raiseEvent('close', e);
        }
    };

    raiseEvent(key:string, value?:any):void {
        //defined in constructor 
    }

    mergeOptions(o:DialogOptions|Object) {

        var options = (o as DialogOptions);
        if (!options) return;

        if (options.xid) {
            this.options.xid = options.xid;
        }

        if (options.header) {
            this.options.header = options.header;
        }

        this.options.commands = options.commands || [
                {
                    text: 'ok',
                    exec: (x)=> true
                }
            ];
    }
}

interface DialogDirectiveScope extends IScope {
    vm:DialogCtrl
}

angular.module('tinyx.dialog', [])
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
