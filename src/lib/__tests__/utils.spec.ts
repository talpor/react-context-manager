import { GlobalStore, UnBoundActions } from '../types';
import { createDispatcher, createReducer, bindScope } from '../utils';

describe('utils', () => {
  const store = {
    test: {
      param: 5
    }
  };
  const testAction = ((state: GlobalStore, param: number) => ({...state, param })) as any
  const dispatchedAction = {
    scope: 'test',
    action: 'testAction',
    params: [1]
  };

  describe('createReducer', () => {
    // TODO: Should rename it
    const unboundActions = {
      test: {
        testAction: (store: GlobalStore) => (...args: any[]) => testAction(store, ...args)
      }
    } as UnBoundActions<GlobalStore>;

    it('should trigger our action in a custom mapped reducer', () => {
      const reducer = createReducer(unboundActions);
      expect(reducer(store, dispatchedAction)).toStrictEqual(testAction(store, 1));
    });
  });

  describe('createDispatcher', () => {
    const dispatch = jest.fn();
    const actions = {
      test: { testAction }
    }

    it('should create an actions dispatcher from a reduced actions object', () => {
      const actionDispatcher = createDispatcher(actions, dispatch);
      const boundScope = bindScope('test', actions.test, dispatch);
      const expectedDispatcherStructure = JSON.stringify({
        test: boundScope
      });
      // Check if kept the original structure
      expect(JSON.stringify(actionDispatcher)).toStrictEqual(expectedDispatcherStructure);

      // Check if the dispatcher was thriggered with the right action object
      actionDispatcher.test.testAction(...dispatchedAction.params);
      expect(dispatch).toHaveBeenCalledWith(dispatchedAction);
    });
  });
});
