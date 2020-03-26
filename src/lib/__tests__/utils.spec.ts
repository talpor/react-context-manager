import { GlobalStore, Modifiers } from '../types';
import { createDispatcher, getNameSpace } from '../utils';

interface Store extends GlobalStore {
  readonly test: {
    readonly param: number;
  };
}

const testAction = (state: Store) => (param: number) => ({
  ...state,
  param
});

const store: Store = {
  test: {
    param: 5
  }
};

const dispatchedAction = {
  actionName: 'testAction',
  params: [1],
  scopeName: 'test',
  type: 'HELPER'
};
const dispatch = jest.fn();
const actions: Modifiers<Store> = {
  test: { testAction }
};

describe('utils', () => {
  describe('createDispatcher', () => {
    it('should create an actions dispatcher from a reduced actions object', () => {
      const actionDispatcher = createDispatcher(store, actions, dispatch);
      const boundScope = getNameSpace(store, 'test', actions.test, dispatch);
      const expectedDispatcherStructure = JSON.stringify({
        test: boundScope
      });
      // Check if kept the original structure
      expect(JSON.stringify(actionDispatcher)).toStrictEqual(
        expectedDispatcherStructure
      );

      // Check if the dispatcher was thriggered with the right action object
      actionDispatcher.test.testAction(...dispatchedAction.params);
      expect(dispatch).toHaveBeenCalledWith({
        ...dispatchedAction,
        stateModifier: expect.any(Function)
      });
    });
  });
});
