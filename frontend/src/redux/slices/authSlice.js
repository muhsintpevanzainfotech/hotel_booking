import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    otpRequired: false,
    tempUser: null
  },
  reducers: {
    loginRequest: (state) => { 
      state.loading = true;
      state.error = null;
    },
    loginOtpRequired: (state, action) => {
      state.loading = false;
      state.otpRequired = true;
      state.tempUser = action.payload; // Contains username/email
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.otpRequired = false;
      state.tempUser = null;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    verifyOtpRequest: (state) => {
      state.loading = true;
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
  loginOtpRequired, 
  loginSuccess, 
  loginFailure, 
  verifyOtpRequest, 
  checkAuth, 
  logout, 
  updateProfileSuccess 
} = authSlice.actions;
export default authSlice.reducer;
