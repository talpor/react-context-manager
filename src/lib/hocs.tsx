import React, { ComponentClass, FunctionComponent, useContext } from 'react';

import { Actions, ContextObject, GlobalStore, UnBoundActions } from './types';

export const parseField = <
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
>(
  store: GS | Actions<GS, UA>,
  rawField: string
) => {
  const parts = rawField.split(':');
  if (parts.length > 1) {
    const [namespace, field] = parts;
    return { [field]: store[namespace][field] };
  } else {
    return { [rawField]: store[rawField] };
  }
};

const storeSelector = <GS extends GlobalStore, UA extends UnBoundActions<GS>>(
  store: GS | Actions<GS, UA>,
  fields: ReadonlyArray<keyof GS>
) => {
  const out = fields.reduce(
    (newStore, field) => ({
      ...newStore,
      ...parseField(store, String(field))
    }),
    {}
  );

  return out;
};

interface MapedProps<GS extends GlobalStore, UA extends UnBoundActions<GS>> {
  readonly actions: Partial<Actions<GS, UA>>;
  readonly store: Partial<GS>;
}

const mapContextToProps = <
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>,
  Props,
  State
>(
  context: ContextObject<GS, UA>
) => (
  WrappedComponent: ComponentClass<Props, State> | FunctionComponent<Props>
) => (...scopes: ReadonlyArray<keyof GS>) => (props: Props) => {
  const StoreConsumer = context.store.Consumer;
  const ActionsConsumer = context.actions.Consumer;
  return (
    <StoreConsumer>
      {store => (
        <ActionsConsumer>
          {actions => {
            const injectedProps: MapedProps<GS, UA> = {
              actions: storeSelector(actions, scopes),
              store: storeSelector(store, scopes)
            };

            return <WrappedComponent {...props} {...injectedProps} />;
          }}
        </ActionsConsumer>
      )}
    </StoreConsumer>
  );
};

export { mapContextToProps };
