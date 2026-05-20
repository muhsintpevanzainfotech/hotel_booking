import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isDark: localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
    notifications: [
      { id: 1, title: 'New Booking', message: 'Deluxe Suite booked by Alex', time: '5m ago', unread: true },
      { id: 2, title: 'System Alert', message: 'Database backup completed', time: '1h ago', unread: false },
    ],
    showNotifications: false
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
    },
    toggleNotifications: (state) => {
      state.showNotifications = !state.showNotifications;
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, unread: false }));
    },
    addNotification: (state, action) => {
      state.notifications.unshift({ ...action.payload, id: Date.now(), unread: true });
    }
  }
});

export const { toggleDarkMode, toggleNotifications, markAllRead, addNotification } = uiSlice.actions;
export default uiSlice.reducer;
