import { createSlice } from '@reduxjs/toolkit';

const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    data: {
      rooms: 0,
      bookings: 0,
      enquiries: 0,
      blogs: 0,
      revenue: 0
    },
    analytics: [],
    loading: false,
    error: null
  },
  reducers: {
    fetchStatsRequest: (state) => { state.loading = true; },
    fetchStatsSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchStatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchAnalyticsRequest: (state) => { state.loading = true; },
    fetchAnalyticsSuccess: (state, action) => {
      state.loading = false;
      state.analytics = action.payload;
    },
    fetchAnalyticsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { 
  fetchStatsRequest, fetchStatsSuccess, fetchStatsFailure,
  fetchAnalyticsRequest, fetchAnalyticsSuccess, fetchAnalyticsFailure 
} = statsSlice.actions;
export default statsSlice.reducer;
