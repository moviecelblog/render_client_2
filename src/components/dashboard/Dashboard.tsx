import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Carte Mes Marques */}
          <Link to="/brands" className="block">
            <div className="glass-panel overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="px-6 py-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-[#53dfb2]/20 rounded-xl p-4">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-white">Mes Marques</h3>
                    <p className="mt-2 text-sm text-white/60">Gérer vos marques et leurs contenus</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Carte Mes Calendriers */}
          <Link to="/calendars" className="block">
            <div className="glass-panel overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="px-6 py-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-[#53dfb2]/20 rounded-xl p-4">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-white">Mes Calendriers</h3>
                    <p className="mt-2 text-sm text-white/60">Planifier vos publications</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Carte Équipe */}
          <Link to="/team" className="block">
            <div className="glass-panel overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="px-6 py-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-[#53dfb2]/20 rounded-xl p-4">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-white">Équipe</h3>
                    <p className="mt-2 text-sm text-white/60">Gérer vos collaborateurs</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Carte Profil */}
          <Link to="/profile" className="block">
            <div className="glass-panel overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="px-6 py-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-[#53dfb2]/20 rounded-xl p-4">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-white">Profil</h3>
                    <p className="mt-2 text-sm text-white/60">Gérer vos informations</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Carte Facturation */}
          <Link to="/billing" className="block">
            <div className="glass-panel overflow-hidden hover:scale-105 transition-all duration-300">
              <div className="px-6 py-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-[#53dfb2]/20 rounded-xl p-4">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-white">Facturation</h3>
                    <p className="mt-2 text-sm text-white/60">Gérer votre abonnement</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Statistiques */}
          <div className="glass-panel overflow-hidden hover:scale-105 transition-all duration-300">
            <div className="px-6 py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#53dfb2]/20 rounded-xl p-4">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5">
                    <h3 className="text-lg font-medium text-white">Statistiques</h3>
                    <p className="mt-2 text-sm text-white/60">Voir vos performances</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
