import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../lib/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobsAPI.getAllJobs();
        setJobs(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching jobs:', err);
        
        // Handle different error types
        if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
          setError('Unable to connect to the server. Please check your internet connection or try again later.');
        } else if (err.response) {
          // Server responded with an error status
          if (err.response.status === 401) {
            setError('You need to be logged in to view jobs. Please log in and try again.');
          } else if (err.response.status === 403) {
            setError('You do not have permission to view these jobs.');
          } else {
            setError(`Failed to fetch jobs: ${err.response.data?.detail || 'Unknown error'}`);
          }
        } else {
          setError('Failed to fetch jobs. Please try again later.');
        }
        
        // Keep the previous jobs data if available
        if (jobs.length === 0) {
          // If no jobs data, provide empty array to prevent UI issues
          setJobs([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    
    // Set up automatic retry for network errors
    const retryTimer = setTimeout(() => {
      if (error && error.includes('Unable to connect') && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
      }
    }, 5000); // Retry every 5 seconds
    
    return () => clearTimeout(retryTimer);
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Jobs</h1>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search jobs by title, company, or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 flex justify-between items-center">
          <p>{error}</p>
          <Button onClick={handleRetry} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      )}

      {loading && jobs.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Loading jobs...</p>
          </div>
        </div>
      ) : filteredJobs.length === 0 && !error ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No jobs found matching your search criteria.</p>
          {searchTerm && (
            <Button onClick={() => setSearchTerm('')} variant="outline">
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <p className="text-sm text-gray-500">{job.company}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  <span className="font-medium">Location:</span> {job.location}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Category:</span> {job.category}
                </p>
                <p className="text-sm line-clamp-3">
                  {job.description && job.description.length > 150
                    ? `${job.description.substring(0, 150)}...`
                    : job.description}
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link to={`/jobs/${job.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
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