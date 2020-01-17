// import { store } from './store'

// Used here in order to make testing easier
export const getNewState = (newState, result) => (state) => {
  Object.keys(result).forEach(key => {
    if (!Array.isArray(result[key])) {
      newState[key] = { ...state[key], ...result[key] }
    } else {
      newState[key] = result[key]
    }
  })
  return newState
}
/**
 * Binds actions to store
 *
 * @param {*} app
 * @returns
 */
const bindActions = (app, store) => {
  const actions = {}
  Object.keys(store.actions).forEach(scope => {
    actions[scope] = {}
    Object.keys(store.actions[scope]).forEach(action => {
  console.log('bind', action);
      actions[scope][action] = async (...args) => {
        let result = {}
        try {
          result = await store.actions[scope][action](app.state, ...args)
        } catch (error) {
          console.log(error)
        }

        const newState = {}
        app.setState(getNewState(newState, result))
        return newState
      }
    })
  })
  return actions
}

export default bindActions;