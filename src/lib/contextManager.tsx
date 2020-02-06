import React, { createContext, Reducer, useReducer } from 'react';
import { Actions, ContextObject, GlobalStore, UnBoundActions } from './types';
import { createDispatcher, createReducer } from './utils';

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
    <CTX.actions.Provider value={actionDispatcher}>
      <CTX.store.Provider value={state}>{children}</CTX.store.Provider>
    </CTX.actions.Provider>
  );
};

export { ContextProvider };
export default ContextProvider;
