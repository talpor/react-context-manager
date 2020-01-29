// import ContextProvider, { Context } from './provider';
/* tslint:disable:no-expression-statement */
import React, {
  createContext,
  Reducer,
  useContext,
  useReducer,
  Context
} from 'react';
import { Actions, GlobalStore, UnBoundActions } from './types';
import { createDispatcher, createReducer } from './utils';

interface ContextItem<GS extends GlobalStore, UA = any> {
  readonly actions: Context<UA>;
  readonly store: Context<GS>;
}

interface ContextManager {
  readonly __version__: string;
  readonly context: {
    readonly [key: string]: ContextItem<any, any>;
  };
}

const contextManager: ContextManager = { __version__: '0.0.1', context: {} };

const initContext = <
  GS extends GlobalStore,
  A extends Actions<GS, UnBoundActions<GS>>
>(
  store: GS,
  actions: A,
  name: string
): ContextItem<GS, A> => {
  if (!!contextManager.context[name]) {
    return contextManager.context[name];
  } else {
    const context: ContextItem<GS, A> = {
      actions: createContext<A>(actions),
      store: createContext<GS>(store)
    };
    (contextManager as any).context[name] = context;

    return context;
  }
};

export interface ContextObject<
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
> {
  readonly actions: Context<Actions<GS, UA>>;
  readonly store: Context<GS>;
}

export const initContext2 = <
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
  readonly context?: ContextObject<GS, UA>;
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
  children,
  name = 'root'
}: ContextProviderProps<GS, UA>) => {
  const reducer = createReducer<GS, typeof actions>(actions);
  const [state, dispatch] = useReducer<Reducer<GS, any>>(reducer, store);

  const actionDispatcher = createDispatcher<GS, typeof actions>(
    actions,
    dispatch
  );

  const CTX =
    context ||
    initContext<GS, Actions<GS, typeof actions>>(state, actionDispatcher, name);

  return (
    <CTX.store.Provider value={state}>
      <CTX.actions.Provider value={actionDispatcher}>
        {children}
      </CTX.actions.Provider>
    </CTX.store.Provider>
  );
};

const getContext = (name = 'root') => {
  if (!contextManager.context[name]) {
    throw new Error(`${name} Context not found`);
  }

  const context = {
    actions: useContext(contextManager.context[name].actions),
    store: useContext(contextManager.context[name].store)
  };

  return context; // Check if need it
};

export { ContextProvider, getContext };
export default ContextProvider;

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
