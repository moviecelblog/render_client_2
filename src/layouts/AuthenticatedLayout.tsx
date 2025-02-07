import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

const AuthenticatedLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isMainAdmin, setIsMainAdmin] = useState(false);

  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');
    // Vérifier si c'est l'admin principal
    setIsMainAdmin(userEmail === 'hello@thirdadvertising.dz');
  }, []);

  const handleLogout = () => {
    // Supprimer l'email de la session
    sessionStorage.removeItem('userEmail');
    // Rediriger vers la page de connexion
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-pink-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/brief" className="text-white font-medium">
                Social Media Manager
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {isMainAdmin && (
                <Link
                  to="/admin"
                  className="text-white hover:text-pink-200 transition-colors"
                >
                  Panel Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-white hover:text-pink-200 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
