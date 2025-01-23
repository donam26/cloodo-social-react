import { createAsyncThunk } from '@reduxjs/toolkit';
import { messengerSlice } from './messengerSlice';

export const { setPackage, setLoading, setError, resetState } = messengerSlice.actions;

export const fetchPackageData = createAsyncThunk(
  'messenger/fetchPackage',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      
      // Gọi API ở đây
      // const response = await api.getPackage();
      
      dispatch(setPackage(/* response.data */));
      dispatch(setLoading(false));
      
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      return rejectWithValue(error.message);
    }
  }
); 