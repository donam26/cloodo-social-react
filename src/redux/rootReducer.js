import { combineReducers } from 'redux';
import messengerSlice from './features/messenger/messengerSlice';
import authSlice from './features/auth/authSlice';

const rootReducer = combineReducers({
  user: authSlice.reducer,
  messenger: messengerSlice.reducer,

});

export default rootReducer;
