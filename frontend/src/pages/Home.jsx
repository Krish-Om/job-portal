import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, isEmployer, isJobseeker } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Find Your Dream Job
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Connect with top employers and discover opportunities that match your skills and career goals.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/register">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md text-lg">
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-md text-lg">
                  Log In
                </button>
              </Link>
            </>
          ) : isJobseeker ? (
            <Link to="/jobs">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md text-lg">
                Browse Jobs
              </button>
            </Link>
          ) : isEmployer ? (
            <Link to="/dashboard">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md text-lg">
                Manage Jobs
              </button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">For Job Seekers</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Browse thousands of job listings</li>
              <li>• Apply with just a few clicks</li>
              <li>• Track your application status</li>
              <li>• Find opportunities matching your skills</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">For Employers</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Post job openings</li>
              <li>• Manage applications</li>
              <li>• Find qualified candidates</li>
              <li>• Build your employer brand</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <ul className="space-y-2 text-gray-600">
              <li>1. Create an account</li>
              <li>2. Complete your profile</li>
              <li>3. Browse or post jobs</li>
              <li>4. Apply or manage applications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 