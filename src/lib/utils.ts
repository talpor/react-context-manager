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

const bindAction = <
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

const bindScope = <
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
