"use strict";
/* tslint:disable:no-expression-statement */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
exports.injectCallback = function (actions, callback) {
    var injectedCallbacks = Object.keys(actions).reduce(function (partial, scope) {
        var _a;
        return __assign(__assign({}, partial), (_a = {}, _a[scope] = Object.keys(actions[scope]).reduce(function (scopePartial, action) {
            var _a;
            return __assign(__assign({}, scopePartial), (_a = {}, _a[action] = callback(scope)(actions[scope][action]), _a));
        }, {}), _a));
    }, {});
    return injectedCallbacks;
};
function buildContext(store, actions) {
    return react_1.createContext(__assign({ actions: actions }, store));
}
exports.createContext = function (module) { return function (store, actions, name) {
    var context = module.Contexts[name] || buildContext(store, actions);
    module.Contexts[name] = context;
    return context;
}; };
exports.getContext = function (module) { return function (name) {
    if (name === void 0) { name = 'root'; }
    var context = module.Contexts[name];
    if (!context) {
        throw new Error('Context with that key not found');
    }
    return react_1.useContext(context); // Check if need it
}; };
exports["default"] = exports.createContext;
