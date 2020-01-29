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
// function buildContext<T extends UnBoundActions>(
//   store: GlobalStore,
//   actions: Actions<T>
// ): Context<any> {
//   return makeContext({ actions, ...store });
// }
// export const createContext = (module: any) => (
//   store: GlobalStore,
//   actions: any,
//   name: any
// ) => {
//   const context = module.Contexts[name] || buildContext(store, actions);
//   module.Contexts[name] = context;
//   return context;
// };
exports.getContext = function (module) { return function (name) {
    if (name === void 0) { name = 'root'; }
    var context = module.Contexts[name];
    if (!context) {
        throw new Error('Context with that key not found');
    }
    return react_1.useContext(context); // Check if need it
}; };
exports.createReducer = function (unBoundActions) {
    // const plainActions = dot.dot()
    return function (state, action) {
        return unBoundActions[action.scope][action.action](state).apply(void 0, action.params);
    };
};
exports.createDispatcher = function (unBoundActions, dispatch) {
    return Object.keys(unBoundActions).reduce(function (init, scope) {
        var _a;
        var currentScope = unBoundActions[scope];
        var boundScope = bindScope(scope, currentScope, dispatch);
        return __assign(__assign({}, init), (_a = {}, _a[scope] = boundScope, _a));
    }, {});
};
var bindAction = function (scope, actionName, _, dispatch) {
    var boundAction = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var actionType = {
            action: String(actionName),
            params: params,
            scope: scope
        };
        return dispatch(actionType);
    };
    return boundAction;
};
var bindScope = function (scopeName, unBoundScope, dispatch) {
    var boundScope = Object.keys(unBoundScope).reduce(function (bs, actionName) {
        var _a;
        var currentAction = unBoundScope[actionName];
        var boundAction = bindAction(scopeName, actionName, currentAction, dispatch);
        return __assign(__assign({}, bs), (_a = {}, _a[actionName] = boundAction, _a));
    }, {});
    return boundScope;
};
// interface Store extends GlobalStore {
//   readonly val: number;
// }
// const gs: Store = {
//   val: 0
// };
// interface UUser extends UnBoundScope {
//   add: (s: Store) => (a: number, b: number) => Store;
// }
// export const user: UUser = {
//   add: (s: Store) => (a: number, b: number) => ({
//     val: s.val + a + b
//   })
// };
// export interface UActions extends UnBoundActions {
//   readonly user: UUser;
// }
// export const uactions: UActions = {
//   user
// };
// const x = createDispatcher(uactions, console.log);
// x.user.add(a)
