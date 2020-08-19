import { Reducer } from 'react';
import {
  Action,
  Actions,
  BoundAction,
  GlobalStore,
  Modifier,
  Modifiers,
  NameSpace,
  Scope,
  UnBoundActions
} from './types';
import { AsyncActionHandlers } from './useReducerAsync';

export interface ActionType<
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
> {
  readonly name: keyof UA;
  readonly action: string;
  readonly params: ReadonlyArray<any>;
}

export interface AsyncAction<GS extends GlobalStore, M extends Modifier<GS>> {
  readonly type: 'HELPER';
  readonly stateModifier: ReturnType<M>;
  readonly scopeName: string;
  readonly actionName: string;
  readonly params: ReadonlyArray<any>;
}

type IAction =
  | { readonly type: 'START_FETCH' }
  | {
      readonly type: 'END_FETCH';
      readonly scopeName: string;
      readonly payload: any;
    }
  | { readonly type: 'ERROR_FETCH' };

export const reducer: Reducer<any, IAction> = (state, innerAction) => {
  switch (innerAction.type) {
    case 'START_FETCH':
      return {
        ...state
        // loading: true,
      };
    case 'END_FETCH':
      return {
        ...state,
        // loading: false,
        ...innerAction.payload
      };
    case 'ERROR_FETCH':
      return {
        ...state
        // loading: false,
      };
    default:
      throw new Error('unknown action type');
  }
};

// const asyncActionHandlers: AsyncActionHandlers<Reducer<State, Action>, AsyncAction> = {
// };

// type AsyncAction = { type: 'FETCH_PERSON'; id: number }

export const asyncActionHandlers: AsyncActionHandlers<
  Reducer<GlobalStore, IAction>,
  AsyncAction<GlobalStore, any>
> = {
  HELPER: ({ dispatch }: any) => async action => {
    dispatch({ type: 'START_FETCH' });
    try {
      const { stateModifier, params, scopeName } = action;
      const response = await stateModifier(...params);
      dispatch({ type: 'END_FETCH', scopeName, payload: response });
      return response;
    } catch (e) {
      dispatch({ type: 'ERROR_FETCH' });
    }
  }
};

export const createDispatcher = <
  GS extends GlobalStore,
  M extends Modifiers<GS>
>(
  state: GS,
  modifiers: M,
  dispatch: any
): Actions<GS, M> => {
  return Object.keys(modifiers).reduce(
    (actions, scopeName) => {
      const currentScope = modifiers[scopeName];
      const nameSpace: NameSpace<GS, typeof currentScope> = getNameSpace(
        state,
        scopeName,
        currentScope,
        dispatch
      );
      return {
        ...actions,
        [scopeName]: nameSpace
      };
    },
    ({} as any) as Actions<GS, M>
  );
};

export const getNameSpace = <
  GS extends GlobalStore,
  M extends Modifiers<GS>,
  S extends Scope<GS>
>(
  state: GS,
  scopeName: keyof M,
  scope: S,
  dispatch: any
): NameSpace<GS, S> => {
  const boundScope: NameSpace<GS, S> = Object.keys(scope).reduce(
    (bs, actionName: string) => {
      const modifier = scope[actionName];
      const action: BoundAction<GS, typeof modifier> = getAction(
        state,
        String(scopeName),
        actionName,
        modifier,
        dispatch
      );
      return {
        ...bs,
        [actionName]: action
      };
    },
    ({} as any) as NameSpace<GS, S>
  );

  return boundScope;
};

export const getAction = <GS extends GlobalStore, M extends Modifier<GS>>(
  state: GS,
  scopeName: string,
  actionName: string,
  modifier: M,
  dispatch: any
) => {
  const action: Action<GS, M> = async (
    ...params: Parameters<ReturnType<M>>
  ) => {
    const actionType: AsyncAction<GS, M> = {
      actionName,
      params,
      scopeName,
      stateModifier: modifier(state) as ReturnType<M>,
      type: 'HELPER'
    };

    const result = await dispatch(actionType);

    return result;
  };
  return action;
};
