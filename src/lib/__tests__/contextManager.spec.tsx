import React, { useContext } from 'react';
import { render, fireEvent, getByTestId, wait } from '@testing-library/react';

import ContextProvider, { initContext } from '../contextManager';
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

const DummyComponent = () => {
  const store = useContext(testContext.store);
  const actions = useContext(testContext.actions);

  return (
    <p>
      <span data-testid="should-change">{store.test.textToChange}</span>
      <span data-testid="not-should-change">{store.test.textToKeep}</span>
      <button
        data-testid="button"
        onClick={() => actions.test.testAction('It worked!')}
      >
        Change
      </button>
    </p>
  );
};

const actions: Actions = {
  test: {
    testAction: (state: Store) => (textToChange: string) => {
      return {
        test: { ...state.test, textToChange }
      };
    }
  }
};

const store: Store = {
  test: {
    textToChange: 'not worked :(',
    textToKeep: 'not change'
  }
};

describe('contextManager', () => {
  describe('ContextProvider', () => {
    it('should change the context state value when a button is clicked', async () => {
      const { container } = render(
        <ContextProvider actions={actions} store={store} context={testContext}>
          <DummyComponent />
        </ContextProvider>
      );
      let shouldChangeElement = getByTestId(container, 'should-change');
      let notShouldChangeElement = getByTestId(container, 'not-should-change');
      expect(shouldChangeElement.textContent).toBe(store.test.textToChange);
      expect(notShouldChangeElement.textContent).toBe(store.test.textToKeep);

      const button = getByTestId(container, 'button');
      fireEvent.click(button);

      await wait(() => getByTestId(container, 'should-change').textContent);

      expect(shouldChangeElement.textContent).toBe(newText);
      expect(notShouldChangeElement.textContent).toBe(store.test.textToKeep);
    });
  });
});
