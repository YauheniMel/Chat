import {
  combineReducers,
  applyMiddleware,
  legacy_createStore as createStore
} from 'redux';

import thunk from 'redux-thunk';
import authReducer from './reducers/auth-reducer';

const reducer = combineReducers({
  auth: authReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

window.store = store;
export default store;
