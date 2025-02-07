import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          await auth.fetchUser(token);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      } finally {
        setIsInitialized(true);
        setIsAuthLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Mettre à jour isAuthLoading quand l'état d'authentification change
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token && auth.token === token && auth.isAuthenticated) {
      setIsAuthLoading(false);
    }
  }, [auth.token, auth.isAuthenticated]);

  console.log('AuthProvider: État actuel:', {
    isAuthenticated: auth.isAuthenticated,
    hasToken: !!auth.token,
    hasUser: !!auth.user,
    isInitialized,
    isAuthLoading
  });

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const contextValue = {
    ...auth,
    isLoading: isAuthLoading
  };

  console.log('AuthProvider: Valeur du contexte:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext doit être utilisé avec AuthProvider');
  }
  return context;
};
