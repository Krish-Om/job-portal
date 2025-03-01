import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Jobs from '../../pages/Jobs';
import { jobsAPI } from '../../lib/api';

// Mock the API
vi.mock('../../lib/api', () => ({
  jobsAPI: {
    getAllJobs: vi.fn(),
  },
}));

// Mock jobs data
const mockJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    description: 'We are looking for a skilled Frontend Developer',
    location: 'Remote',
    category: 'Development',
    company: 'TechCorp',
    posted_date: '2023-06-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Backend Engineer',
    description: 'Experienced Backend Engineer needed',
    location: 'New York, NY',
    category: 'Development',
    company: 'DataSystems Inc',
    posted_date: '2023-06-10T09:30:00Z',
  },
];

describe('Jobs Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('displays jobs when API call is successful', async () => {
    // Mock successful API response
    jobsAPI.getAllJobs.mockResolvedValue({ data: mockJobs });

    render(
      <BrowserRouter>
        <Jobs />
      </BrowserRouter>
    );

    // Initially should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    });

    // Check if both jobs are displayed
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    
    // Check if company names are displayed
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
    expect(screen.getByText('DataSystems Inc')).toBeInTheDocument();
  });

  it('displays error message when API call fails', async () => {
    // Mock failed API response
    jobsAPI.getAllJobs.mockRejectedValue({ 
      response: { data: { detail: 'Failed to fetch jobs' } } 
    });

    render(
      <BrowserRouter>
        <Jobs />
      </BrowserRouter>
    );

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch jobs/i)).toBeInTheDocument();
    });
  });
}); 