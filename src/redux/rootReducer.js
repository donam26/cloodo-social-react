import { combineReducers } from 'redux';
import messengerSlice from './features/messenger/messengerSlice';

const rootReducer = combineReducers({
  messenger: messengerSlice.reducer,
});

export default rootReducer;
