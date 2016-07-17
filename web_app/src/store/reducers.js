import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import loginReducer from './../routes/Login/modules/login';
import tempReducer from './../routes/Home/modules/temps';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    auth: loginReducer,
    temps: tempReducer,

    router,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
