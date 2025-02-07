import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  interface Toast {
    message: string;
    type: 'success' | 'error';
  }

  const [toast, setToast] = useState<Toast | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Soumission du formulaire de mot de passe');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({
        message: 'Les mots de passe ne correspondent pas',
        type: 'error'
      });
      return;
    }

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      console.log('Résultat du changement de mot de passe:', result);
      
      if (result.success) {
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setToast({
          message: 'Mot de passe modifié avec succès',
          type: 'success'
        });
      } else {
        setToast({
          message: result.error || 'Une erreur est survenue lors du changement de mot de passe',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setToast({
        message: 'Une erreur est survenue lors du changement de mot de passe',
        type: 'error'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await updateProfile(formData.name, formData.email);
    
    if (result.success) {
      setIsEditing(false);
    } else {
      setToast({
        message: result.error || 'Une erreur est survenue lors de la mise à jour du profil',
        type: 'error'
      });
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="relative">
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg backdrop-blur-md transition-all duration-300 transform ${
            toast.type === 'success' 
              ? 'bg-[#53dfb2]/10 border border-[#53dfb2]/20 text-[#53dfb2]' 
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          } shadow-lg`}
          style={{
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <div className="flex items-center space-x-2">
            <span className={`text-lg ${toast.type === 'success' ? 'text-[#53dfb2]' : 'text-red-500'}`}>
              {toast.type === 'success' ? '✓' : '✕'}
            </span>
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent">
        Mon Profil
      </h1>
      
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-6">
          <h3 className="text-xl font-medium text-white">
            Informations personnelles
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Gérez vos informations personnelles et vos préférences.
          </p>
        </div>
        
        <div className="border-t border-white/10">
          <dl>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-white/5 transition-colors">
                  <dt className="text-sm font-medium text-white/60">Nom complet</dt>
                  <dd className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#53dfb2]"
                    />
                  </dd>
                </div>
                
                <div className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-white/10 hover:bg-white/5 transition-colors">
                  <dt className="text-sm font-medium text-white/60">Email</dt>
                  <dd className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#53dfb2]"
                    />
                  </dd>
                </div>
              </form>
            ) : (
              <>
                <div className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4 hover:bg-white/5 transition-colors">
                  <dt className="text-sm font-medium text-white/60">Nom complet</dt>
                  <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{user?.name}</dd>
                </div>
                
                <div className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-white/10 hover:bg-white/5 transition-colors">
                  <dt className="text-sm font-medium text-white/60">Email</dt>
                  <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{user?.email}</dd>
                </div>
              </>
            )}
            
            <div className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-white/10 hover:bg-white/5 transition-colors">
              <dt className="text-sm font-medium text-white/60">Rôle</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#53dfb2]/20 text-[#53dfb2]">
                  {user?.role}
                </span>
              </dd>
            </div>
            
            <div className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-white/10 hover:bg-white/5 transition-colors">
              <dt className="text-sm font-medium text-white/60">Abonnement</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#53dfb2]/20 text-[#53dfb2]">
                  Pro
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="px-6 py-6 border-t border-white/10">
          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-white/60">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#53dfb2]"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-white/60">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#53dfb2]"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/60">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#53dfb2]"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="glass-button w-full sm:w-auto bg-[#53dfb2]/20 hover:bg-[#53dfb2]/30"
                >
                  Changer le mot de passe
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="glass-button w-full sm:w-auto"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="glass-button w-full sm:w-auto bg-[#53dfb2]/20 hover:bg-[#53dfb2]/30"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="glass-button w-full sm:w-auto"
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="glass-button w-full sm:w-auto"
                  >
                    Modifier le profil
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(true)}
                    className="glass-button w-full sm:w-auto"
                  >
                    Changer le mot de passe
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
