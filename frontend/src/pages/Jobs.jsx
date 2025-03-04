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
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    category: ''
  });
  const maxRetries = 3;

  // Function to fetch jobs based on search parameters
  const fetchJobs = async (params = {}) => {
    try {
      setLoading(true);
      let response;
      
      // If we have search parameters, use searchJobs, otherwise use getAllJobs
      if (params.query || params.location || params.category) {
        response = await jobsAPI.searchJobs(params);
      } else {
        response = await jobsAPI.getAllJobs();
      }
      
      setJobs(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching jobs:', err);
      
      // figure out what went wrong and show a nice message
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        setError('Unable to connect to the server. Please check your internet connection or try again later.');
      } else if (err.response) {
        // server sent back an error code
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
      
      // don't wipe out the jobs if we already had some
      if (jobs.length === 0) {
        // if we don't have any jobs yet, use empty array so the UI doesn't break
        setJobs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchJobs();
    
    // Set up automatic retry for network errors
    if (error && error.includes('Unable to connect') && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        fetchJobs(searchParams);
      }, 3000); // Retry after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  // Debounced search handler
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== searchParams.query) {
        setSearchParams(prev => ({ ...prev, query: searchTerm }));
        fetchJobs({ ...searchParams, query: searchTerm });
      }
    }, 500); // Wait 500ms after user stops typing before searching

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle location filter
  const handleLocationFilter = (location) => {
    setSearchParams(prev => ({ ...prev, location }));
    fetchJobs({ ...searchParams, location });
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSearchParams(prev => ({ ...prev, category }));
    fetchJobs({ ...searchParams, category });
  };

  // Optional clear filters button
  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams({ query: '', location: '', category: '' });
    fetchJobs({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Available Jobs</h1>
        <div className="w-full md:w-1/3">
          <Input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
      </div>

      {/* Advanced filters (optional) */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.values(searchParams).some(param => param) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          {retryCount > 0 && error.includes('Unable to connect') && (
            <div className="mt-2 text-sm">
              Retrying... ({retryCount}/{maxRetries})
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <div className="text-sm text-gray-500 mt-1">{job.company}</div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span 
                    className="cursor-pointer hover:underline"
                    onClick={() => handleLocationFilter(job.location)}
                  >
                    {job.location}
                  </span>
                </div>
                <div className="mb-4 text-sm text-gray-500">
                  <span 
                    className="cursor-pointer hover:underline"
                    onClick={() => handleCategoryFilter(job.category)}
                  >
                    {job.category}
                  </span>
                </div>
                <p className="text-gray-700 line-clamp-3">
                  {job.description.length > 150
                    ? `${job.description.substring(0, 150)}...`
                    : job.description}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Link
                  to={`/jobs/${job.id}`}
                  className="w-full"
                >
                  <Button variant="default" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || searchParams.location || searchParams.category
              ? `No jobs found matching your search criteria`
              : "No jobs available at the moment."}
          </p>
        </div>
      )}
    </div>
  );
} 