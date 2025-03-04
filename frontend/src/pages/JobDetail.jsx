import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isJobseeker } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    resume_path: '',
    cover_letter: '',
  });
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await jobsAPI.getJob(id);
        setJob(response.data);
      } catch (err) {
        setError('Failed to fetch job details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    setApplying(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      await applicationsAPI.submitApplication({
        job_id: Number.parseInt(id, 10),
        ...applicationData,
      });
      setApplicationSuccess(true);
      setApplying(false);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <p className="text-lg">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Job not found or has been removed.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
      
      {applicationSuccess && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          Your application has been submitted successfully!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{job.title}</CardTitle>
          <div className="flex flex-col space-y-1">
            <p className="text-lg font-medium">{job.company}</p>
            <p className="text-gray-500">{job.location}</p>
            <p className="text-gray-500">Category: {job.category}</p>
            <p className="text-gray-500">
              Posted: {new Date(job.posted_date).toLocaleDateString()}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-2">Job Description</h3>
          <div className="whitespace-pre-line">{job.description}</div>
        </CardContent>
        <CardFooter>
          {isJobseeker && !applying && !applicationSuccess && (
            <Button onClick={handleApply} className="w-full">
              Apply for this Job
            </Button>
          )}
          {!isAuthenticated && !applicationSuccess && (
            <Button onClick={handleApply} className="w-full">
              Login to Apply
            </Button>
          )}
          {applying && (
            <form onSubmit={handleSubmitApplication} className="w-full space-y-4">
              <div className="space-y-2">
                <label htmlFor="resume_path" className="text-sm font-medium">
                  Resume Link
                </label>
                <Input
                  id="resume_path"
                  name="resume_path"
                  type="text"
                  placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                  value={applicationData.resume_path}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="cover_letter" className="text-sm font-medium">
                  Cover Letter
                </label>
                <textarea
                  id="cover_letter"
                  name="cover_letter"
                  rows={5}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write a brief cover letter..."
                  value={applicationData.cover_letter}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Submit Application</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setApplying(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 