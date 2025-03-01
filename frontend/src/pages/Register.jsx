import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'jobseeker',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/login', { state: { message: 'Registration successful. Please login.' } });
    } catch (err) {
      console.error('Registration error:', err);
      // Handle different types of error responses
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (typeof err.response.data === 'object' && err.response.data !== null) {
          if (err.response.data.detail) {
            setError(typeof err.response.data.detail === 'string' 
              ? err.response.data.detail 
              : 'Registration failed. Please check your information.');
          } else if (err.response.data.message) {
            setError(typeof err.response.data.message === 'string'
              ? err.response.data.message
              : 'Registration failed. Please check your information.');
          } else {
            // If there's no detail or message, create a message from validation errors if they exist
            const errorMessages = [];
            for (const [key, value] of Object.entries(err.response.data)) {
              if (Array.isArray(value)) {
                errorMessages.push(`${key}: ${value.join(', ')}`);
              } else if (typeof value === 'string') {
                errorMessages.push(`${key}: ${value}`);
              }
            }
            
            if (errorMessages.length > 0) {
              setError(errorMessages.join('. '));
            } else {
              setError('Registration failed. Please check your information.');
            }
          }
        } else {
          setError('Registration failed. Please check your information.');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="jobseeker"
                    checked={formData.role === 'jobseeker'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Job Seeker</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={formData.role === 'employer'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Employer</span>
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 