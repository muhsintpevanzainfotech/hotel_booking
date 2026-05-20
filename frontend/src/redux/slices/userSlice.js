import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addUserRequest: (state) => {
      state.loading = true;
    },
    addUserSuccess: (state, action) => {
      state.loading = false;
      state.users.push(action.payload);
    },
    addUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserRequest: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      const index = state.users.findIndex(u => u._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserRequest: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.loading = false;
      state.users = state.users.filter(u => u._id !== action.payload);
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure,
  addUserRequest, addUserSuccess, addUserFailure,
  updateUserRequest, updateUserSuccess, updateUserFailure,
  deleteUserRequest, deleteUserSuccess, deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
