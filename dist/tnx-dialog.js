/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	var DialogCtrl = (function () {
	    function DialogCtrl($scope) {
	        var _this = this;
	        this.options = {};
	        this.disposables = new Rx.CompositeDisposable();
	        this.show = function (e) {
	            _this.mergeOptions(e.args.value);
	            if (_this.dialog) {
	                _this.dialog.showModal();
	            }
	        };
	        this.close = function (e) {
	            if (_this.dialog) {
	                _this.dialog.close();
	                _this.raiseEvent('close', e);
	            }
	        };
	        this.mergeOptions($scope);
	        if ($scope.owner) {
	            var xEvents = $scope.owner.xEvents.asObservable();
	            this.disposables.add(xEvents
	                .where(function (e) { return e.sender != _this; })
	                .where(function (e) { return e.args.value.idx == _this.options.xid; })
	                .where(function (e) { return e.args.key == 'show'; })
	                .subscribe(this.show));
	            this.disposables.add(xEvents
	                .where(function (e) { return e.sender != _this; })
	                .where(function (e) { return e.args.value.idx == _this.options.xid; })
	                .where(function (e) { return e.args.key == 'close'; })
	                .subscribe(function (e) { return _this.close(null); }));
	        }
	        this.runCommand = function (c) {
	            c.canExec = c.canExec || (function (x) { return true; });
	            if (c.canExec($scope.owner)) {
	                var close = c.exec(_this);
	                if (close) {
	                    _this.close(null);
	                }
	            }
	        };
	        $scope.$on('$destroy', function () {
	            console.log('DialogCtrl disposing');
	            // watcherDispose();
	            _this.dispose();
	        });
	    }
	    Object.defineProperty(DialogCtrl.prototype, "header", {
	        get: function () {
	            return this.options && this.options.header ? this.options.header : null;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DialogCtrl.prototype.dispose = function () {
	        this.disposables.dispose();
	    };
	    DialogCtrl.prototype.raiseEvent = function (key, value) {
	        //defined in constructor 
	    };
	    DialogCtrl.prototype.mergeOptions = function (o) {
	        var options = o;
	        if (!options)
	            return;
	        if (options.xid) {
	            this.options.xid = options.xid;
	        }
	        if (options.header) {
	            this.options.header = options.header;
	        }
	        this.options.commands = options.commands || [
	            {
	                text: 'ok',
	                exec: function (x) { return true; }
	            }
	        ];
	    };
	    DialogCtrl.$inject = ['$scope'];
	    return DialogCtrl;
	}());
	angular.module('tinyx.dialog', [])
	    .controller('DialogCtrl', DialogCtrl)
	    .directive('tnxDialog', function () {
	    return {
	        restrict: 'E',
	        controller: 'DialogCtrl',
	        controllerAs: 'vm',
	        templateUrl: function (element, attr) {
	            return attr.templateUrl || "./";
	        },
	        scope: /*<DialogCtrlScope>*/ {
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
	        compile: function () {
	            return {
	                pre: function (scope, element, attr) {
	                    var dialog = element.find('dialog')[0];
	                    if (dialog) {
	                        componentHandler.upgradeElements(dialog);
	                    }
	                    if (scope.vm) {
	                        scope.vm.dialog = dialog;
	                    }
	                }
	            };
	        },
	        transclude: true
	    };
	});


/***/ }
/******/ ]);
//# sourceMappingURL=tnx-dialog.js.map