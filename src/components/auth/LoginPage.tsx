import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
      navigate('/brief');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@thirdadvertising.dz')) {
      setError('Veuillez utiliser une adresse email @thirdadvertising.dz');
      return;
    }

    try {
      // Si c'est l'admin principal, accès direct
      if (email === 'hello@thirdadvertising.dz') {
        sessionStorage.setItem('userEmail', email);
        navigate('/admin');
        return;
      }

      // Pour les autres utilisateurs, vérifier l'autorisation
      console.log('Vérification de l\'utilisateur:', email);
      const response = await fetch(`${API_URL}/admin/verify-user/${encodeURIComponent(email)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Accès non autorisé');
      }

      const data = await response.json();
      console.log('Réponse de vérification:', data);
      
      // Stocker l'email dans la session
      sessionStorage.setItem('userEmail', email);
      
      // Rediriger selon le rôle
      if (data.isAdmin) {
        console.log('Redirection vers le panel admin');
        navigate('/admin', { replace: true });
      } else {
        console.log('Redirection vers le formulaire de brief');
        navigate('/brief', { replace: true });
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Erreur lors de la connexion. Contactez un administrateur.');
      // En cas d'erreur, supprimer l'email de la session
      sessionStorage.removeItem('userEmail');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-pink-800 to-pink-600">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Social Media Manager
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Adresse Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="votre@thirdadvertising.dz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <p className="mt-2 text-sm text-red-300">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Utilisez votre adresse email @thirdadvertising.dz
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
