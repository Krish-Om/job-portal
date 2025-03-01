import { Button } from "../components/ui/button";

/**
 * A fallback component to display when API requests fail
 * 
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 * @param {boolean} props.showRetry - Whether to show the retry button
 */
export default function ErrorFallback({ message, onRetry, showRetry = true }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-6 my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg 
            className="h-6 w-6 text-red-600" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message || 'Something went wrong. Please try again later.'}</p>
          </div>
          {showRetry && onRetry && (
            <div className="mt-4">
              <Button 
                onClick={onRetry} 
                variant="outline" 
                size="sm" 
                className="text-red-800 hover:bg-red-100 border-red-300"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 