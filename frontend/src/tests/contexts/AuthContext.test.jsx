import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../lib/api';

// Mock the API
vi.mock('../../lib/api', () => ({
  authAPI: {
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <div data-testid="user-info">
            Logged in as: {user?.username} ({user?.role})
          </div>
          <button onClick={logout} data-testid="logout-button">
            Logout
          </button>
        </>
      ) : (
        <button 
          onClick={() => login({ username: 'testuser', password: 'password' })}
          data-testid="login-button"
        >
          Login
        </button>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('provides authentication state and methods', async () => {
    // Mock successful login
    authAPI.login.mockResolvedValue({
      data: { access_token: 'fake-token', token_type: 'bearer' }
    });
    
    // Mock user data
    authAPI.getCurrentUser.mockResolvedValue({
      data: { id: 1, username: 'testuser', email: 'test@example.com', role: 'jobseeker' }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially not authenticated
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    
    // Click login button
    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-button'));
    
    // Verify login was called
    expect(authAPI.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password'
    });
    
    // Wait for authentication state to update
    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toBeInTheDocument();
    });
    
    // Verify user info is displayed
    expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as: testuser (jobseeker)');
    
    // Test logout
    await user.click(screen.getByTestId('logout-button'));
    expect(authAPI.logout).toHaveBeenCalled();
  });
}); 