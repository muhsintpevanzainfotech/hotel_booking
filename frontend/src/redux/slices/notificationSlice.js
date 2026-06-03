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
    markNotificationsReadRequest: (state, action) => {},
    markNotificationsReadSuccess: (state, action) => {
      const id = action.payload;
      if (id) {
        state.list = state.list.map(n => n._id === id ? { ...n, isRead: true } : n);
      } else {
        state.list = state.list.map(n => ({ ...n, isRead: true }));
      }
    },
    deleteNotificationRequest: (state, action) => {
      state.loading = true;
    },
    deleteNotificationSuccess: (state, action) => {
      state.loading = false;
      state.list = state.list.filter(n => n._id !== action.payload);
    },
    deleteNotificationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { 
  fetchNotificationsRequest, 
  fetchNotificationsSuccess, 
  fetchNotificationsFailure,
  markNotificationsReadRequest,
  markNotificationsReadSuccess,
  deleteNotificationRequest,
  deleteNotificationSuccess,
  deleteNotificationFailure
} = notificationSlice.actions;

export default notificationSlice.reducer;
