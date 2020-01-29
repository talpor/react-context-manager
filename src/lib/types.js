"use strict";
exports.__esModule = true;
var gs = {
    val: 0
};
exports.user = {
    add: function (s) { return function (a, b) { return ({
        val: s.val + a + b
    }); }; }
};
exports.buser = {
    add: function (a, b) { return null; }
};
exports.uactions = {
    user: exports.user
};
exports.bactions = {
    user: exports.buser
};
// interface ActionParams {
//   params: ReadonlyArray<any>
// }
// const actionReducer = (state: GlobalStore, callback: UnBoundAction, action: ActionParams) => (state, action) => callback(state)(...action.params);
// const  bindAction = <GS extends GlobalStore, UA extends UnBoundAction>(state: GS, action: UA): BoundAction<UA> =>{
//   return (...args: Parameters<ReturnType<UA>>) => action(state)(...args)
// }
// const createR foo<GS extends GlobalStore, UA extends UnBoundActions>(state: GS, actions: UA) => {
//   return Object.keys(actions).reduce((acc, scopes) => (
//     {
//       ...acc,
//       [scope]: Object.keys(actions[scopes]).reduce((acc2, actionName) => ({
//               [actionName]: (...args) => bindAction(scope, actions[scope][actionName] )
//                   }), {})
//     }), {});
// }
// const createFunctionReducer = ()
//   const reducer = (state, action) => {
//     switch (action.type) {
//       case 'changeTheme':
//         return {
//           ...state,
//           theme: action.newTheme
//         };
//       default:
//         return state;
//     }
//   };
// function createReducer<GS extends GlobalStore, UA extends UnBoundActions>(state: GS, actions: UnBoundActions): any {
//   return ({
//   user: userReducer(user, action),
//   basket: basketReducer(basket, action)
// });
// }
// user.add(gs)();
// const userb: BoundScope<typeof user> = {};
