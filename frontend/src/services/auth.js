import axios from 'axios';

import API_URL from '../constants';

export const login = async (credentials) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
  localStorage.setItem('token', data.access_token);
  return data;
};

export const register = async (userData) => {
  const { data } = await axios.post(`${API_URL}/auth/register`, userData);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
};