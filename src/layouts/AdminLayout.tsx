import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');
    
    if (!userEmail) {
      navigate('/');
      return;
    }

    // Rediriger vers /brief si ce n'est pas l'admin principal
    if (userEmail !== 'hello@thirdadvertising.dz') {
      navigate('/brief');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-pink-600">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
