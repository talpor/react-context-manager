"use strict";
exports.__esModule = true;
// import ContextProvider, { Context } from './provider';
/* tslint:disable:no-expression-statement */
var react_1 = require("react");
var utils_1 = require("./utils");
var contextManager = { __version__: '0.0.1', context: {} };
exports.contextManager = contextManager;
// export const buildContext = (store: GlobalStore, actions: Actions) =>
//   createContext({ actions, ...store });
// export let Context;
// const sstore = {};
// interface UserActions extends UnBoundScope {
//   readonly add: (store: GlobalStore) => (nu: number) => GlobalStore;
// }
// const user: UserActions = {
//   add: (store: GlobalStore) => (nu: number): GlobalStore => ({})
// };
// interface SActions extends UnBoundActions {
//   readonly user: UserActions;
// }
// const sactions: SActions = {
//   user
// };
// const x = bindActions(sstore, sactions);
exports.initContext = function (store, actions, name) {
    if (!!contextManager[name]) {
        return contextManager[name];
    }
    else {
        var context = {
            actions: react_1.createContext(actions),
            store: react_1.createContext(store)
        };
        contextManager.context[name] = context;
        return context;
    }
};
var ContextProvider = function (_a) {
    var store = _a.store, actions = _a.actions, children = _a.children, _b = _a.name, name = _b === void 0 ? 'root' : _b;
    var reducer = utils_1.createReducer(actions);
    var _c = react_1.useReducer(reducer, store), state = _c[0], dispatch = _c[1];
    var actionDispatcher = utils_1.createDispatcher(actions, dispatch);
    var Context = exports.initContext(state, actionDispatcher, name);
    return (<Context.store.Provider value={state}>
      <Context.actions.Provider value={actionDispatcher}>
        {children}
      </Context.actions.Provider>
    </Context.store.Provider>);
};
exports["default"] = ContextProvider;
// const ContextProvider: FunctionComponent<ContextProviderProps> = ({
//   store,
//   actions,
//   children,
//   name = 'root'
// }) => {
//   const [state, dispatcher] = useReducer(reducer, store);
//   const boundActions = injectCallback(actions, binding);
//   const dispatcherActions = injectCallback(boundActions, dispatching(dispatcher));
//   const Context = createContext(contextManager)(state, dispatcherActions, name);
//   contextManager.StoreContext =
//     contextManager.StoreContext || createContext(store);
//   const { state, dispatch } = useContext(contextManager.StoreContext);
//   const newContext = bindActions(state, actions, dispatch);
//   contextManager.StoreContext =
//     contextManager.StoreContext || createContext(newContext);
//   // contextManager.ActionsContext =
//   //   contextManager.ActionsContext || createContext(newContext.actions);
//   // <contextManager.ActionsContext.Provider
//   //   value={{ actions: newContext.actions }}
//   // >
//   // </contextManager.ActionsContext.Provider>
//   return (
//     <contextManager.StoreContext.Provider value={newContext}>
//       {children}
//     </contextManager.StoreContext.Provider>
//   );
// };
// contextManager.ContextProvider = ContextProvider;
// export default contextManager;
//   const value = {
//     actions: dispatcherActions,
//     ...state
//   };
//   return (
//     <Context.Provider value={value}>
//       {children}
//     </Context.Provider>
//   );
// };
