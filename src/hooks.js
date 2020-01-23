import { useContext } from 'react';

export const getContext = (module) => (name = 'root') => {
  const context = module.Contexts[name];
  if (!context) {
    throw new Error('Context with that key not found');
  }

  return useContext(context);  // Check if need it
};
