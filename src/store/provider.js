import React from 'react';

import bindActions from './binding';

export const buildContext = (store, actions) => React.createContext({ actions, ...store });
export let Context;

const ContextProvider = ({ store, actions, children }) => {
  const bindedActions = bindActions(store, actions);
  Context = Context || buildContext(store, bindedActions);
  const value = {
    actions: bindedActions,
    ...store
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
