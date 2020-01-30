import { createDispatcher } from '../utils';

describe('utils', () => {
  describe('createDispatcher', () => {
    const dispatch = jest.fn();
    const actions = {
      test: jest.fn(),
    };
    it('should return actions with dispatch on them', () => {
      const actionDispatcher = createDispatcher(actions, dispatch);
      console.log(actionDispatcher);
    });
  });
});
