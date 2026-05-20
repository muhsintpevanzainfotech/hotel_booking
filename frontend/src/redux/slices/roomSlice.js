import { createSlice } from '@reduxjs/toolkit';

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    fetchRoomsRequest: (state) => { state.loading = true; },
    fetchRoomsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchRoomsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addRoom: (state, action) => {
      state.items.push(action.payload);
    },
    deleteRoomSuccess: (state, action) => {
      state.items = state.items.filter(room => room._id !== action.payload);
    }
  }
});

export const { fetchRoomsRequest, fetchRoomsSuccess, fetchRoomsFailure, addRoom, deleteRoomSuccess } = roomSlice.actions;
export default roomSlice.reducer;
