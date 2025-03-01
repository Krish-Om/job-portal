import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';

// This component helps suppress the React Router v6 future flag warnings
export default function CustomRouter({ children }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // This ensures we're only rendering on the client side
    setIsClient(true);
    
    // Add this to suppress the specific warnings
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      if (
        typeof args[0] === 'string' && 
        (args[0].includes('startTransition') || args[0].includes('relativeSplatPath'))
      ) {
        return;
      }
      originalConsoleWarn(...args);
    };
    
    return () => {
      console.warn = originalConsoleWarn;
    };
  }, []);
  
  if (!isClient) {
    return null;
  }
  
  return <BrowserRouter>{children}</BrowserRouter>;
} 