import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { API_URL } from '@/utils/config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

// Global cache to prevent multiple simultaneous auth checks
let authCheckPromise: Promise<any> | null = null;
let lastAuthCheck = 0;
const AUTH_CHECK_COOLDOWN = 30000; // 30 seconds

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireOnboarding = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Check if we need to force a recheck
      const forceRecheck = localStorage.getItem('forceAuthRecheck');
      if (forceRecheck) {
        localStorage.removeItem('forceAuthRecheck');
        authCheckPromise = null; // Clear cache
        lastAuthCheck = 0; // Reset timer
      }

      // Use cached result if recent
      const now = Date.now();
      if (authCheckPromise && (now - lastAuthCheck) < AUTH_CHECK_COOLDOWN) {
        try {
          const result = await authCheckPromise;
          setIsAuthenticated(result.isAuthenticated);
          setOnboardingCompleted(result.onboardingCompleted);
          setIsLoading(false);
          return;
        } catch (error) {
          // Continue with fresh check if cached one failed
        }
      }

      // Create new auth check promise
      authCheckPromise = performAuthCheck(token);
      lastAuthCheck = now;

      try {
        const result = await authCheckPromise;
        setIsAuthenticated(result.isAuthenticated);
        setOnboardingCompleted(result.onboardingCompleted);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const performAuthCheck = async (token: string) => {
    try {
      // Verify token with backend
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      // Check onboarding status
      const onboardingResponse = await fetch(`${API_URL}/api/onboarding/data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let onboardingCompleted = false;
      if (onboardingResponse.ok) {
        const result = await onboardingResponse.json();
        if (result.success && result.data) {
          onboardingCompleted = result.data.isCompleted;
        }
      }

      return {
        isAuthenticated: true,
        onboardingCompleted
      };
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear auth data on failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If we're on the onboarding page and onboarding is completed, redirect to dashboard
  if (requireOnboarding && onboardingCompleted === true) {
    return <Navigate to="/dashboard" replace />;
  }

  // If we're not on the onboarding page and onboarding is not completed, redirect to onboarding
  if (!requireOnboarding && onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;