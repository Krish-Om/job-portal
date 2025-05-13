import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { applicationsAPI, filesAPI } from '../lib/api';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export default function EmployerApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getJobApplications(jobId);
      setApplications(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.response?.data?.detail || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await applicationsAPI.updateStatus(applicationId, newStatus);
      // Refresh applications list
      await fetchApplications();
    } catch (err) {
      console.error('Error updating application status:', err);
      setError(err.response?.data?.detail || 'Failed to update status');
    }
  };

  const downloadResume = async (resumePath) => {
    try {
      const response = await filesAPI.getFileUrl(resumePath);
      window.open(response.data.url, '_blank');
    } catch (err) {
      console.error('Error downloading resume:', err);
      setError('Failed to download resume');
    }
  };

  const sortApplications = (apps) => {
    return [...apps].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'name':
          return a.applicant_name.localeCompare(b.applicant_name);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  };

  const filterApplications = (apps) => {
    if (filterStatus === 'all') return apps;
    return apps.filter(app => app.status === filterStatus);
  };

  const displayedApplications = filterApplications(sortApplications(applications));

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchApplications}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Job Applications</h1>
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {displayedApplications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No applications found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedApplications.map((application) => (
            <Card key={application.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{application.applicant_name}</CardTitle>
                    <CardDescription>{application.applicant_email}</CardDescription>
                  </div>
                  <Badge className={getStatusBadgeColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600">
                  Applied on: {new Date(application.created_at).toLocaleDateString()}
                </p>
                {application.cover_letter && (
                  <p className="mt-4 text-sm">{application.cover_letter}</p>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => downloadResume(application.resume_path)}
                >
                  Download Resume
                </Button>
                {application.status === 'pending' && (
                  <div className="flex gap-2 w-full">
                    <Button
                      className="flex-1"
                      onClick={() => updateApplicationStatus(application.id, 'accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
