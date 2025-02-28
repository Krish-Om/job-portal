import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.login(data);
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="input"
        onChange={(e) => setData({...data, username: e.target.value})}
      />
      <input
        type="password"
        placeholder="Password"
        className="input"
        onChange={(e) => setData({...data, password: e.target.value})}
      />
      <button type="submit" className="button">Login</button>
    </form>
  );
};

export default Login;