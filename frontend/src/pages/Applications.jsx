import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI, filesAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/badge';

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await applicationsAPI.getUserApplications();
        setApplications(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching applications:', err);
        
        // Handle different error types
        if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
          setError('Unable to connect to the server. Please check your internet connection or try again later.');
        } else if (err.response) {
          // Server responded with an error status
          if (err.response.status === 401) {
            setError('Your session may have expired. Please log in again.');
          } else if (err.response.status === 403) {
            setError('You do not have permission to view these applications.');
          } else {
            setError(`Failed to fetch applications: ${err.response.data?.detail || 'Unknown error'}`);
          }
        } else {
          setError('Failed to fetch your applications. Please try again later.');
        }
        
        // Keep the previous applications data if available
        if (applications.length === 0) {
          setApplications([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
    
    // Set up automatic retry for network errors
    const retryTimer = setTimeout(() => {
      if (error && error.includes('Unable to connect') && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
      }
    }, 5000); // Retry every 5 seconds
    
    return () => clearTimeout(retryTimer);
  }, [user, retryCount, applications.length, error]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleViewResume = async (resumePath) => {
    try {
      const response = await filesAPI.getFileUrl(resumePath);
      if (response.data && response.data.download_url) {
        window.open(response.data?.download_url, '_blank');
      }
    } catch (err) {
      console.error('Error accessing resume:', err);
      setError('Unable to access resume file');
    }
  };

 

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 flex justify-between items-center">
          <p>{error}</p>
          <Button onClick={handleRetry} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Loading your applications..</p>
          </div>
        </div>
      ) : applications.length === 0 && !error ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
          <Link to="/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {application.job_title || 'Job Application'}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Applied on: {new Date(application.applied_date).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  <span className="font-medium">Status:</span>{' '}
                  <Badge
                    variant={
                      application.status === 'pending'
                        ? 'warning'
                        : application.status === 'accepted'
                        ? 'success'
                        : application.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </p>
                {application.cover_letter && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Cover Letter:</p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {application.cover_letter}
                    </p>
                  </div>
                )}
                {application.resume_path && (
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewResume(application.resume_path)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Resume
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link to={`/jobs/${application.job_id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Job
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}