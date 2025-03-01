import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

// This component wraps AuthProvider and can use router hooks
export default function RouterAuthProvider({ children }) {
  // You can use router hooks here if needed in the future
  
  return <AuthProvider>{children}</AuthProvider>;
} 