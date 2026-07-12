import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// Rendered by ProtectedRoute when the user isn't authenticated.
// No landing page - it immediately kicks off the Deriv OAuth redirect.
export default function AuthGate() {
  const { login } = useAuth() || {};
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!hasTriggeredRef.current && typeof login === 'function') {
      hasTriggeredRef.current = true;
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <LoadingSpinner fullScreen message="Redirecting to Deriv login..." />
    </div>
  );
}
