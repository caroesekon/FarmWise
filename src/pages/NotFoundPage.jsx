import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">Page not found</p>
        <Link to="/" className="btn-primary inline-block mt-6">
          Go Home
        </Link>
      </div>
    </div>
  );
}