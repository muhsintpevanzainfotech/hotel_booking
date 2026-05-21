import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  },
  reducers: {
    loginRequest: (state) => { 
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    checkAuth: (state) => { state.loading = true; },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    updateProfileSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  }
});

export const { 
  loginRequest, 
  loginSuccess, 
  loginFailure, 
  checkAuth, 
  logout, 
  updateProfileSuccess 
} = authSlice.actions;
export default authSlice.reducer;
