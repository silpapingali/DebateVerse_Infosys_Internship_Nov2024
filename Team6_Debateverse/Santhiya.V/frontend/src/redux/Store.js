import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  user: userReducer,
});

const store = createStore(rootReducer);

export default store;