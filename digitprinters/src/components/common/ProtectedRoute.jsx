import { Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import AuthGate from './AuthGate';
import { useAuth } from '../../context/AuthContext';

const logProtectedRoute = (msg, data) => {
  console.info(`[ProtectedRoute] ${msg}`, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};

export default function ProtectedRoute() {
  const {
    isAuthenticated = false,
    loading = false,
    loginStatus = 'unauthenticated',
    error = null,
    accessToken = null,
    initializationStep = ''
  } = useAuth() || {};
  const location = useLocation();

  logProtectedRoute('ProtectedRoute check', {
    path: location?.pathname,
    isAuthenticated,
    loading,
    loginStatus,
    hasError: !!error,
    hasAccessToken: !!accessToken,
    initializationStep,
  });

  // Show loading spinner while checking authentication
  if (loading || loginStatus === 'initializing' || (accessToken && !isAuthenticated && !error)) {
    logProtectedRoute('Auth or market initialization in progress, showing spinner', {
      path: location.pathname,
      initializationStep,
    });
    return <LoadingSpinner fullScreen message={initializationStep || 'Connecting to markets...'} />;
  }

  // Show login gate if not authenticated (rendered inline, no redirect,
  // since '/' itself is now a protected route and would otherwise loop)
  if (!isAuthenticated) {
    logProtectedRoute('User not authenticated, showing login gate', {
      path: location.pathname,
      loginStatus,
      attemptedPath: location.pathname,
    });
    // Store the attempted path so we can redirect after login
    const redirectTo = (location?.pathname || '/') + (location?.search || '');
    try {
      localStorage.setItem('deriv_post_login_redirect', redirectTo);
    } catch (err) {
      console.warn('[ProtectedRoute] Failed to set post-login redirect:', err);
    }
    return <AuthGate />;
  }

  logProtectedRoute('Access granted to protected route', {
    path: location.pathname,
  });

  // User is authenticated, render the protected component
  return <Outlet />;
}
