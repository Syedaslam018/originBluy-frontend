import axios from 'axios';

import { loginSuccess, logoutSuccess, registerSuccess } from './authSlice';

export const loginUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, userData);
    console.log(response)
    dispatch(loginSuccess(response.data));
    return { success: true };
  } catch (error) {
    console.error('Login failed', error);
    return { success: false };
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('/api/auth/register', userData);
    dispatch(registerSuccess(response.data));
    return { success: true };
  } catch (error) {
    console.error('Registration failed', error);
    return { success: false };
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(logoutSuccess());
};