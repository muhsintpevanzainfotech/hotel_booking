import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    fetchRoomsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRoomsSuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchRoomsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchRoomsRequest, fetchRoomsSuccess, fetchRoomsFailure } = roomSlice.actions;
export default roomSlice.reducer;
