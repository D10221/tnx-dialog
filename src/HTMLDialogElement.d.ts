/*
* source: https://gist.github.com/andruhon/2310fcff2860426b06ec
* */
/***
 * using cast: let dialog = <HTMLDialogElement> document.getElementById("mydialog");
 */
export interface HTMLDialogElement extends HTMLElement {
    open: boolean,
    returnValue: string,
    close: ()=>any,
    show: ()=>any,
    showModal: ()=>any
}

declare var HTMLDialogElement: {
    prototype: HTMLDialogElement;
    new(): HTMLDialogElement;
};

