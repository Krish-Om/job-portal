import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI, filesAPI } from '../lib/api';
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
    cover_letter: '',
  });
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds the 5MB limit');
      setSelectedFile(null);
      e.target.value = null;
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      setFileError('Only PDF and Word documents are allowed');
      setSelectedFile(null);
      e.target.value = null;
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setUploadingFile(true);

    try {
      // 1. First upload the file
      const fileUploadResponse = await filesAPI.uploadFile(selectedFile);
      const filePath = fileUploadResponse.data.file_path;

      // 2. Then submit the application with the file path
      const formData = new FormData();
      formData.append('job_id', Number.parseInt(id, 10));
      formData.append('cover_letter', applicationData.cover_letter);
      formData.append('resume_path', filePath);

      await applicationsAPI.submitApplication(formData);

      setApplicationSuccess(true);
      setApplying(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setUploadingFile(false);
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
                <label htmlFor="resume" className="text-sm font-medium">
                  Resume/CV (Max 5MB)
                </label>
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
                {fileError && (
                  <p className="text-sm text-red-500">{fileError}</p>
                )}
                {selectedFile && (
                  <p className="text-sm text-green-600">
                    Selected file: {selectedFile.name}
                  </p>
                )}
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
                <Button type="submit" disabled={uploadingFile}>
                  {uploadingFile ? 'Uploading...' : 'Submit Application'}
                </Button>
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