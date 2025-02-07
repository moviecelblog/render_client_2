import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, token, isLoading } = useAuthContext();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !token) {
        setShouldRedirect(true);
      }
    }
  }, [isLoading, isAuthenticated, token]);

  console.log('PrivateRoute: État d\'authentification:', { 
    isAuthenticated, 
    hasToken: !!token, 
    pathname: location.pathname,
    isLoading,
    shouldRedirect
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (shouldRedirect) {
    console.log('PrivateRoute: Redirection vers /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('PrivateRoute: Affichage du contenu protégé');
  return <>{children}</>;
};

export default PrivateRoute;
