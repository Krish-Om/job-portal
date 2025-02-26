import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/Home';
import JobList from './components/jobs/JobList';
import JobDetail from './components/jobs/JobDetail';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ApplicationForm from './components/jobs/ApplicationForm';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/apply/:jobId" element={<ApplicationForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
