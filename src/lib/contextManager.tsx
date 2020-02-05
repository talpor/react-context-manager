// import ContextProvider, { Context } from './provider';
/* tslint:disable:no-expression-statement */
import React, { Context, createContext, Reducer, useReducer } from 'react';
import { Actions, GlobalStore, UnBoundActions } from './types';
import { createDispatcher, createReducer } from './utils';

export interface ContextObject<
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
> {
  readonly actions: Context<Actions<GS, UA>>;
  readonly store: Context<GS>;
}

export const initContext = <
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
>(): ContextObject<GS, UA> => ({
  actions: createContext<Actions<GS, UA>>({} as any),
  store: createContext<GS>({} as any)
});

interface ContextProviderProps<
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
> {
  readonly actions: UA;
  readonly context: ContextObject<GS, UA>;
  readonly children: ReadonlyArray<JSX.Element> | JSX.Element;
  readonly name: string;
  readonly store: GS;
}

const ContextProvider = <
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
>({
  store,
  actions,
  context,
  children
}: ContextProviderProps<GS, UA>) => {
  const CTX = context;
  const reducer = createReducer<GS, typeof actions>(actions);
  const [state, dispatch] = useReducer<Reducer<GS, any>>(reducer, store);

  const actionDispatcher = createDispatcher<GS, typeof actions>(
    actions,
    dispatch
  );

  return (
    <CTX.store.Provider value={state}>
      <CTX.actions.Provider value={actionDispatcher}>
        {children}
      </CTX.actions.Provider>
    </CTX.store.Provider>
  );
};

export { ContextProvider };
export default ContextProvider;
