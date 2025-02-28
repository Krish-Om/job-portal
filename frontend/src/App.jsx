import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/Home';
import JobList from './components/jobs/JobList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmployerDashboard from './components/employer/EmployerDashboard';
import EmployerProfile from './components/profiles/EmployerProfile';
import JobSeekerProfile from './components/profiles/JobSeekerProfile';
import CreateJob from './components/employer/CreateJob';
import ManageJobs from './components/employer/ManageJobs';
import Applications from './components/jobseeker/Applications';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import JobDetail from './components/JobDetail';  // Updated import path
import './App.css';
import './styles/dashboard.css';
import './styles/profile.css';
import './styles/jobs.css';
import './styles/navbar.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<JobList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/jobs/:id" element={<JobDetail />} />
                        <Route path="/jobs/create" element={<CreateJob />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
