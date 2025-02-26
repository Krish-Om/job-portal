import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/Home';
import JobList from './components/jobs/JobList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmployerProfile from './components/profiles/EmployerProfile';
import JobSeekerProfile from './components/profiles/JobSeekerProfile';
import EmployerDashboard from './components/employer/EmployerDashboard';
import CreateJob from './components/employer/CreateJob';
import ManageJobs from './components/employer/ManageJobs';
import Applications from './components/jobseeker/Applications';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/jobs" element={<JobList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Employer Routes */}
                    <Route path="/employer/*" element={
                        <PrivateRoute allowedRole="EMPLOYER">
                            <Routes>
                                <Route path="profile" element={<EmployerProfile />} />
                                <Route path="dashboard" element={<EmployerDashboard />} />
                                <Route path="jobs/create" element={<CreateJob />} />
                                <Route path="jobs" element={<ManageJobs />} />
                            </Routes>
                        </PrivateRoute>
                    } />

                    {/* Protected JobSeeker Routes */}
                    <Route path="/jobseeker/*" element={
                        <PrivateRoute allowedRole="JOBSEEKER">
                            <Routes>
                                <Route path="profile" element={<JobSeekerProfile />} />
                                <Route path="applications" element={<Applications />} />
                            </Routes>
                        </PrivateRoute>
                    } />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
