import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';

// this fixes those annoying React Router warnings that kept spamming the console
export default function CustomRouter({ children }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // wait until we're in the browser
    setIsClient(true);
    
    // super hacky way to hide those stupid warnings
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