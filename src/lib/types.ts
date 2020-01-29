export interface GlobalStore {
  readonly [key: string]: any;
}

// (store) => (userid: number) => globalStore
export type UnBoundAction<GS extends GlobalStore> = (
  store: GS
) => (...args: ReadonlyArray<any>) => GS;

// (userid: number) => void
export type BoundAction<GS extends GlobalStore, T extends UnBoundAction<GS>> = (
  ...args: Parameters<ReturnType<T>>
) => void;

// { user: { add: UnBoundAction }}
export interface UnBoundScope<GS extends GlobalStore> {
  readonly [actionName: string]: UnBoundAction<GS>;
}

// { user: { add: BoundAction }}
export type BoundScope<GS extends GlobalStore, S extends UnBoundScope<GS>> = {
  readonly [A in keyof S]: BoundAction<GS, S[A]>
};

export interface UnBoundActions<GS extends GlobalStore> {
  readonly [scope: string]: UnBoundScope<GS>;
}

export type Actions<GS extends GlobalStore, T extends UnBoundActions<GS>> = {
  readonly [S in keyof T]: BoundScope<GS, T[S]>
};

// export type Action = (...args: ReadonlyArray<any>) => void;

// interface ActionTest extends UnBoundActions {
//   readonly user: User;
// }

// interface User extends UnBoundScope {
//   readonly add: (store: GlobalStore) => (x: number, y: number) => GlobalStore;
// }

// const UX: ActionTest = {
//   user: {
//     add: store => (a, b) => ({ ...store, xs: a + b })
//   }
// };

// const Bind: Actions<ActionTest> = {
//   user: {
//     add: (a: number, b: number) => 4 + a + b
//   }
// };

// export const myFunction = (_: GlobalStore) => (a: number, b: number): number =>
//   a + b;

// export const x: ReturnType<typeof myFunction> = () => 6;

// export const myScope = {
//   add: myFunction
// };

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

// export const buser: BoundScope<UUser> = {
//   add: (a: number, b: number) => null
// };

// export interface UActions extends UnBoundActions {
//   readonly user: UUser;
// }

// export const uactions: UActions = {
//   user
// };

// export const bactions: Actions<UActions> = {
//   user: buser
// };

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
