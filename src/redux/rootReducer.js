import { combineReducers } from 'redux';
import messengerReducer from './features/messenger/messengerSlice';
import authSlice from './features/auth/authSlice';

const rootReducer = combineReducers({
  user: authSlice.reducer,
  messenger: messengerReducer
});

export default rootReducer;
