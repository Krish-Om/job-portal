import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    company: user?.username || '',
  });

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const response = await jobsAPI.getAllJobs();
        // Filter jobs by employer_id (in a real app, the API would do this filtering)
        const employerJobs = response.data.filter(job => job.employer_id === user?.id);
        setJobs(employerJobs);
      } catch (err) {
        setError('Failed to fetch your jobs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEmployerJobs();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    try {
      const response = await jobsAPI.createJob(jobFormData);
      setJobs((prev) => [...prev, response.data]);
      setShowNewJobForm(false);
      setJobFormData({
        title: '',
        description: '',
        location: '',
        category: '',
        company: user?.username || '',
      });
    } catch (err) {
      setError('Failed to create job. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.deleteJob(jobId);
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
      } catch (err) {
        setError('Failed to delete job. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <p className="text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employer Dashboard</h1>
        <Button onClick={() => setShowNewJobForm(!showNewJobForm)}>
          {showNewJobForm ? 'Cancel' : 'Post New Job'}
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      {showNewJobForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitJob} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Job Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={jobFormData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  value={jobFormData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  value={jobFormData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="category"
                  name="category"
                  value={jobFormData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={jobFormData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit">Post Job</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <h2 className="text-xl font-semibold mb-4">Your Posted Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job.id}>
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
                <p className="text-sm mb-2">
                  <span className="font-medium">Posted:</span>{' '}
                  {new Date(job.posted_date).toLocaleDateString()}
                </p>
                <p className="text-sm line-clamp-2">
                  {job.description.length > 100
                    ? `${job.description.substring(0, 100)}...`
                    : job.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link to={`/jobs/${job.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <div className="space-x-2">
                  <Link to={`/applications/${job.id}`}>
                    <Button variant="secondary" size="sm">
                      View Applications
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 