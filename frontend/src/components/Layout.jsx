import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-card shadow-sm py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 