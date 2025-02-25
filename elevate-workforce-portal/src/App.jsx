import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JobList from './components/jobs/JobList';
import JobDetail from './components/jobs/JobDetail';
import './styles/main.css';

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;