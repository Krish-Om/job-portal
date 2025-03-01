import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import CustomRouter from './components/CustomRouter';

// Layout
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Applications from './pages/Applications';
import EmployerDashboard from './pages/EmployerDashboard';

// Create a client
const queryClient = new QueryClient();

// Add this import
import ApiDebug from './components/ApiDebug';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute requireAuth={true} />}>
                <Route path="/applications" element={<Applications />} />
              </Route>
              
              <Route element={<ProtectedRoute requireAuth={true} requireEmployer={true} />}>
                <Route path="/dashboard" element={<EmployerDashboard />} />
              </Route>

              {/* Add this route inside your Routes component */}
              <Route path="/debug" element={<ApiDebug />} />
            </Route>
          </Routes>
        </AuthProvider>
      </CustomRouter>
    </QueryClientProvider>
  );
}

export default App;
