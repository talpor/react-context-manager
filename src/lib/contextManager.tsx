import React, { createContext } from 'react';
import { useReducerAsync } from './useReducerAsync';
import { Actions, ContextObject, GlobalStore, UnBoundActions } from './types';
import { asyncActionHandlers, createDispatcher, reducer } from './utils';

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
  // TODO: Find typings to allow GS | Promise<GS> in reducer return type
  const [state, dispatch] = useReducerAsync(
    reducer,
    store,
    asyncActionHandlers
  );

  const actionDispatcher = createDispatcher<GS, typeof actions>(
    state,
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
