import React from 'react';

export const parseField = (store, rawField) => {
  const parts = rawField.split(':');
  if (parts.length > 1) {
    const [namespace, field] = parts;
    return { [field]: store[namespace][field] };
  } else {
    return { [rawField]: store[rawField] };
  }
};


const storeSelector = (store, fields) => {
  const out = fields.reduce(
    (newStore, field) => ({
      ...newStore,
      ...parseField(store, field)
    }),
    {}
  );

  return out;
};


const mapContextToProps = (module, requiredScope = 'store') => (WrappedComponent) => (storeFields) => (props) => (
  <module.Context.Consumer>
    {store => {
      const injectedProp = {[requiredScope]: storeSelector(requiredScope !== 'store' ? store[requiredScope] : store, storeFields)}
      return <WrappedComponent {...props} {...injectedProp} />
    }}
  </module.Context.Consumer>
);


export default mapContextToProps;
