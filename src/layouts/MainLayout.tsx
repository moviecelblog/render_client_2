import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/common/Logo';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Barre de navigation */}
      <nav className="glass-panel fixed w-full top-0 z-40 backdrop-blur-xl bg-[#2d2d67]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard">
                  <Logo size="medium" color="white" />
                </Link>
              </div>

              {/* Navigation principale */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
                <Link
                  to="/dashboard"
                  className={`${
                    isActive('/dashboard') 
                      ? 'nav-link-active'
                      : 'nav-link text-white/80 hover:text-white'
                  } inline-flex items-center text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/brands"
                  className={`${
                    isActive('/brands')
                      ? 'nav-link-active'
                      : 'nav-link text-white/80 hover:text-white'
                  } inline-flex items-center text-sm font-medium`}
                >
                  Marques
                </Link>
                <Link
                  to="/calendars"
                  className={`${
                    isActive('/calendars')
                      ? 'nav-link-active'
                      : 'nav-link text-white/80 hover:text-white'
                  } inline-flex items-center text-sm font-medium`}
                >
                  Calendriers
                </Link>
                <Link
                  to="/team"
                  className={`${
                    isActive('/team')
                      ? 'nav-link-active'
                      : 'nav-link text-white/80 hover:text-white'
                  } inline-flex items-center text-sm font-medium`}
                >
                  Équipe
                </Link>
              </div>
            </div>

            {/* Menu utilisateur */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <button
                  ref={buttonRef}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="max-w-xs glass-panel flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53dfb2] p-1 hover:bg-white/10 transition-colors"
                >
                  <span className="sr-only">Ouvrir le menu utilisateur</span>
                  <div className="h-10 w-10 rounded-full bg-[#53dfb2]/20 flex items-center justify-center">
                    <svg className="h-6 w-6 text-[#53dfb2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div 
                    ref={menuRef}
                    className="glass-panel dropdown-menu absolute right-0 mt-2 w-48 rounded-xl overflow-hidden animate-menuAppear"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <Link
                      to="/billing"
                      className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Facturation
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="pt-24">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
