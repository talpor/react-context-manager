import React, { useContext } from 'react';
import {
  render,
  fireEvent,
  getByTestId,
  wait,
  act,
} from '@testing-library/react';

import ContextProvider, { initContext } from '../contextManager';
import { GlobalStore, Modifiers, Scope } from '../types';

jest.useFakeTimers();

interface Store extends GlobalStore {
  readonly test: {
    readonly textToChange: string;
    readonly textToKeep: string;
  };
}

interface TestScope extends Scope<Store> {
  readonly delay: (
    _: Store
  ) => (time: number, textToChange: string) => Promise<Store>;
  readonly testAction: (_: Store) => (textToChange: string) => Store;
}

interface Actions extends Modifiers<Store> {
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
    delay: (state: Store) => async (time: number, textToChange: string) => {
      const newStore = { test: { ...state.test, textToChange } };
      return new Promise((resolve) =>
        setTimeout(() => {
          return resolve(newStore);
        }, time)
      ) as Promise<Store>;
    },
    testAction: (state: Store) => (textToChange: string) => {
      return {
        test: { ...state.test, textToChange },
      };
    },
  },
};

const store: Store = {
  test: {
    textToChange: 'not worked :(',
    textToKeep: 'not change',
  },
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

    it('should handle syncronous calls', async () => {
      const { container } = render(
        <ContextProvider actions={actions} store={store} context={testContext}>
          <DummyAsyncComponent />
        </ContextProvider>
      );
      let shouldChangeElement = getByTestId(container, 'should-change');
      expect(shouldChangeElement.textContent).toBe(store.test.textToChange);

      const button = getByTestId(container, 'button');
      await act(async () => {
        await fireEvent.click(button);
      });
      await jest.advanceTimersByTime(1200);

      await wait(() => getByTestId(container, 'should-change').textContent);
      expect(shouldChangeElement.textContent).toBe('First Call');

      await jest.runAllTimers(); // or jest.advanceTimersByTime(1000)

      await wait(() => getByTestId(container, 'should-change').textContent);
      expect(shouldChangeElement.textContent).toBe('Second Call');
    });
  });
});

export const DummyAsyncComponent = () => {
  const store = useContext(testContext.store);
  const actions = useContext(testContext.actions);

  const runActions = async () => {
    await actions.test.delay(1000, 'First Call');
    await actions.test.delay(500, 'Second Call');
  };

  return (
    <p>
      <span data-testid="should-change">{store.test.textToChange}</span>
      <span data-testid="not-should-change">{store.test.textToKeep}</span>
      <button data-testid="button" onClick={runActions}>
        Run!
      </button>
    </p>
  );
};
