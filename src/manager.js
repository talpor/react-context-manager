import React from 'react';

export const buildContext = (store, actions) => React.createContext({ actions, ...store });

const createContext = (module) => (store, actions, name) => {
  const context = module.Contexts[name] || buildContext(store, actions);
  module.Contexts[name] = context;

  return context;
};

export default createContext;
