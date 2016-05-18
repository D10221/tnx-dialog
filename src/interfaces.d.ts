import IScope = angular.IScope;
import {IObservableController} from "tnx-core/dist/tnx-core";
import {HTMLDialogElement} from "./HTMLDialogElement";

export interface IDialogController extends Rx.Disposable {
    dialog:HTMLDialogElement ; 
}

export interface IDialogCommand {
    /***
     * takes: owner: as parent controller , returns dialog canClose
     */
    exec:(x?:any) => boolean;
    canExec?:(x?:any) => boolean;
    text:string;
}


export interface DialogDirectiveScope extends IScope {
    vm:IDialogController
}

export interface DialogOptions {

    xid?:string;

    header?:any ;

    commands?:IDialogCommand[];

}

export interface DialogCtrlScope extends IScope, DialogOptions {

    owner:IObservableController;
}