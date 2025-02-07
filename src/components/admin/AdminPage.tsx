import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Prompt {
  _id: string;
  name: string;
  category: 'gpt' | 'dalle' | 'claude' | 'runway';
  content: string;
  description: string;
  lastModified: string;
  modifiedBy: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'prompts'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
      console.log('Pas d\'email trouvé en session, redirection vers login');
      navigate('/');
      return;
    }

    console.log('Email en session:', userEmail);
    fetchUsers();
    fetchPrompts();
  }, [navigate]);

  const getHeaders = () => {
    const userEmail = sessionStorage.getItem('userEmail');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'user-email': userEmail || ''
    };
  };

  const fetchUsers = async () => {
    try {
      console.log('Récupération des utilisateurs...');
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des utilisateurs');
      }
      
      const data = await response.json();
      console.log('Utilisateurs récupérés:', data);
      setUsers(data);
      setError('');
    } catch (error: any) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      setError(error.message);
      if (error.message.includes('Non authentifié') || error.message.includes('Accès non autorisé')) {
        sessionStorage.removeItem('userEmail');
        navigate('/');
      }
    }
  };

  const fetchPrompts = async () => {
    try {
      console.log('Récupération des prompts...');
      const response = await fetch(`${API_URL}/admin/prompts`, {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des prompts');
      }
      
      const data = await response.json();
      console.log('Prompts récupérés:', data);
      setPrompts(data);
      setError('');
    } catch (error: any) {
      console.error('Erreur lors de la récupération des prompts:', error);
      setError(error.message);
      if (error.message.includes('Non authentifié') || error.message.includes('Accès non autorisé')) {
        sessionStorage.removeItem('userEmail');
        navigate('/');
      }
    }
  };

  const addUser = async () => {
    try {
      setError('');
      setSuccess('');

      if (!newEmail.trim()) {
        setError('L\'email est requis');
        return;
      }

      console.log('Ajout d\'un nouvel utilisateur:', newEmail);
      const response = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email: newEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout de l\'utilisateur');
      }

      console.log('Utilisateur ajouté:', data);
      setNewEmail('');
      setSuccess('Utilisateur ajouté avec succès');
      fetchUsers();
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      setError(error.message);
      if (error.message.includes('Non authentifié') || error.message.includes('Accès non autorisé')) {
        sessionStorage.removeItem('userEmail');
        navigate('/');
      }
    }
  };

  const deleteUser = async (email: string) => {
    try {
      setError('');
      setSuccess('');

      console.log('Suppression de l\'utilisateur:', email);
      const response = await fetch(`${API_URL}/admin/users/${email}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la suppression de l\'utilisateur');
      }

      console.log('Utilisateur supprimé:', email);
      setSuccess('Utilisateur supprimé avec succès');
      fetchUsers();
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      setError(error.message);
      if (error.message.includes('Non authentifié') || error.message.includes('Accès non autorisé')) {
        sessionStorage.removeItem('userEmail');
        navigate('/');
      }
    }
  };

  const updatePrompt = async () => {
    if (!selectedPrompt) return;

    try {
      setError('');
      setSuccess('');

      console.log('Mise à jour du prompt:', selectedPrompt._id);
      const response = await fetch(`${API_URL}/admin/prompts/${selectedPrompt._id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          content: selectedPrompt.content,
          description: selectedPrompt.description
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour du prompt');
      }

      console.log('Prompt mis à jour');
      setSuccess('Prompt mis à jour avec succès');
      fetchPrompts();
      setSelectedPrompt(null);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du prompt:', error);
      setError(error.message);
      if (error.message.includes('Non authentifié') || error.message.includes('Accès non autorisé')) {
        sessionStorage.removeItem('userEmail');
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-pink-600 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Panel d'Administration</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 px-4 py-2 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-300 px-4 py-2 rounded-md mb-6">
            {success}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl overflow-hidden">
          <div className="flex border-b border-white/20">
            <button
              className={`px-6 py-3 text-white ${activeTab === 'users' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Utilisateurs
            </button>
            <button
              className={`px-6 py-3 text-white ${activeTab === 'prompts' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveTab('prompts')}
            >
              Prompts
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'users' ? (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="nouvel@thirdadvertising.dz"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50"
                  />
                  <button
                    onClick={addUser}
                    className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                  >
                    Ajouter
                  </button>
                </div>

                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.email}
                      className="flex justify-between items-center p-4 bg-white/5 rounded-md"
                    >
                      <div>
                        <span className="text-white">{user.email}</span>
                        {user.isAdmin && (
                          <span className="ml-2 px-2 py-1 text-xs bg-pink-500 text-white rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteUser(user.email)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  {prompts.map((prompt) => (
                    <div
                      key={prompt._id}
                      className={`p-4 bg-white/5 rounded-md cursor-pointer ${
                        selectedPrompt?._id === prompt._id ? 'ring-2 ring-pink-500' : ''
                      }`}
                      onClick={() => setSelectedPrompt(prompt)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{prompt.name}</span>
                        <span className="text-sm text-white/60">{prompt.category}</span>
                      </div>
                      <p className="text-white/80 text-sm">{prompt.description}</p>
                    </div>
                  ))}
                </div>

                {selectedPrompt && (
                  <div className="space-y-4">
                    <textarea
                      value={selectedPrompt.content}
                      onChange={(e) =>
                        setSelectedPrompt({ ...selectedPrompt, content: e.target.value })
                      }
                      className="w-full h-96 px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50 font-mono text-sm"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={updatePrompt}
                        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
