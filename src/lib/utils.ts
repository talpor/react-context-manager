/* tslint:disable:no-expression-statement */

import {
  Actions,
  BoundAction,
  BoundScope,
  GlobalStore,
  UnBoundAction,
  UnBoundActions,
  UnBoundScope
} from './types';

// type Callback = (
//   scope: string
// ) => (action: any) => (args: ReadonlyArray<any>) => void;

// export const injectCallback = (
//   actions: UnBoundActions,
//   callback: Callback
// ): Actions<typeof actions> => {
//   const injectedCallbacks: Actions<typeof actions> = Object.keys(
//     actions
//   ).reduce((partial: Actions<typeof actions>, scope: string) => {
//     return {
//       ...partial,
//       [scope]: Object.keys(actions[scope]).reduce(
//         (scopePartial: any, action: string) => {
//           return {
//             ...scopePartial,
//             [action]: callback(scope)(actions[scope][action])
//           };
//         },
//         {}
//       )
//     };
//   }, {});

//   return injectedCallbacks;
// };

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

// export default createContext;

export interface ActionType<
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
> {
  readonly scope: keyof UA;
  readonly action: string;
  readonly params: ReadonlyArray<any>;
}

export const createReducer = <
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
>(
  unBoundActions: UA
) => {
  return (state: GS, action: any) =>
    unBoundActions[action.scope][action.action](state)(...action.params);
};

export const createDispatcher = <
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
>(
  unBoundActions: UA,
  dispatch: any
): Actions<GS, UA> => {
  return Object.keys(unBoundActions).reduce(
    (init, scope) => {
      const currentScope = unBoundActions[scope];
      const boundScope: BoundScope<GS, typeof currentScope> = bindScope(
        scope,
        currentScope,
        dispatch
      );

      return {
        ...init,
        [scope]: boundScope
      };
    },
    ({} as any) as Actions<GS, UA>
  );
};

export const bindAction = <
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>,
  US extends UnBoundScope<GS>,
  A extends UnBoundAction<GS>
>(
  scope: keyof UA,
  actionName: keyof US,
  _: A,
  dispatch: any
) => {
  const boundAction: BoundAction<GS, A> = (
    ...params: Parameters<ReturnType<A>>
  ) => {
    const actionType: ActionType<GS, UA> = {
      action: String(actionName),
      params,
      scope
    };

    return dispatch(actionType);
  };
  return boundAction;
};

export const bindScope = <
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>,
  US extends UnBoundScope<GS>
>(
  scopeName: keyof UA,
  unBoundScope: US,
  dispatch: any
): BoundScope<GS, US> => {
  const boundScope: BoundScope<GS, US> = Object.keys(unBoundScope).reduce(
    (bs, actionName: string) => {
      const currentAction = unBoundScope[actionName];
      const boundAction: BoundAction<GS, typeof currentAction> = bindAction(
        String(scopeName),
        actionName,
        currentAction,
        dispatch
      );
      return {
        ...bs,
        [actionName]: boundAction
      };
    },
    ({} as any) as BoundScope<GS, US>
  );

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
