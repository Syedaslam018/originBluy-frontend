import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // Retrieve user from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Store user in localStorage
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Store user in localStorage
    },
    logoutSuccess: (state) => {
      state.user = null;
      localStorage.removeItem('user'); // Remove user from localStorage on logout
    },
  },
});

export const { loginSuccess, logoutSuccess, registerSuccess } = authSlice.actions;
export default authSlice.reducer;
