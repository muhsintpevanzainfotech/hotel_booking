import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {
    fetchNotificationsRequest: (state) => { state.loading = true; },
    fetchNotificationsSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchNotificationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    markNotificationsReadRequest: (state) => {},
    markNotificationsReadSuccess: (state) => {
      state.list = state.list.map(n => ({ ...n, isRead: true }));
    }
  }
});

export const { 
  fetchNotificationsRequest, 
  fetchNotificationsSuccess, 
  fetchNotificationsFailure,
  markNotificationsReadRequest,
  markNotificationsReadSuccess
} = notificationSlice.actions;

export default notificationSlice.reducer;
