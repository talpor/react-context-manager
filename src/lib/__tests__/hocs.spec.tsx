import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react'

import ContextProvider, { initContext } from '../contextManager';
import { mapContextToProps } from '../hocs';
import { GlobalStore, UnBoundActions, UnBoundScope } from '../types';

interface Store extends GlobalStore {
  readonly test: {
    readonly textToChange: string;
    readonly textToKeep: string;
  };
}

interface TestScope extends UnBoundScope<Store> {
  readonly testAction: (_: Store) => (textToChange: string) => Store;
}
interface Actions extends UnBoundActions<Store> {
  readonly test: TestScope;
}

const testContext = initContext<Store, Actions>();
const newText = 'It worked!';


class DummyComponent extends React.Component<any, any> {
  render() {
    const { actions, store } = this.props;
    return (
      <p>
        <span data-testid="should-change">{store.test.textToChange}</span>
        <span data-testid="not-should-change">{store.test.textToKeep}</span>
        <button data-testid="button" onClick={() => actions.test.testAction('It worked!')}>
          Change
        </button>
      </p>
    );
  }
};

describe('hocs', () => {
  describe('ContextProvider', () => {
    const actions: Actions = {
      test: {
        testAction: (state: Store) => (textToChange: string) => ({
          ...state, test: { ...state.test, textToChange } 
        })
      }
    };

    const store: Store = {
      test: {
        textToChange: 'not worked :(',
        textToKeep: 'not change'
      }
    };

    it('should change the context state value when a button is clicked', () => {
      const WrappedComponent = mapContextToProps(testContext)(DummyComponent)('test');
      const { container } = render(
        <ContextProvider actions={actions} store={store} context={testContext}>
          <WrappedComponent />
        </ContextProvider>
      );
      const shouldChangeElement = getByTestId(container, 'should-change');
      const notShouldChangeElement = getByTestId(container, 'not-should-change');
      expect(shouldChangeElement.textContent).toBe(store.test.textToChange);
      expect(notShouldChangeElement.textContent).toBe(store.test.textToKeep);
      const button = getByTestId(container, 'button');
      fireEvent.click(button);
      expect(shouldChangeElement.textContent).toBe(newText);
      expect(notShouldChangeElement.textContent).toBe(store.test.textToKeep);
    });
  });
});