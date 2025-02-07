import React, { Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import BriefForm from './components/brands/BriefForm';
import BrandsList from './components/brands/BrandsList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import PrivateRoute from './components/auth/PrivateRoute';
import LandingPage from './components/landing/LandingPage';
import { useAuth } from './hooks/useAuth';

// Lazy loading des autres composants
const Profile = React.lazy(() => import('./components/profile/Profile'));
const Billing = React.lazy(() => import('./components/billing/Billing'));
const Team = React.lazy(() => import('./components/team/Team'));
const Calendars = React.lazy(() => import('./components/calendars/Calendars'));
const Results = React.lazy(() => import('./components/results/Results'));

// Composant de chargement
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
  </div>
);

// Composant pour rediriger en fonction de l'authentification
const HomeRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/brands"
            element={
              <PrivateRoute>
                <MainLayout>
                  <BrandsList />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/brands/new"
            element={
              <PrivateRoute>
                <MainLayout>
                  <BriefForm />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/calendars"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Calendars />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/team"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Team />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/billing"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Billing />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/results/:calendarId"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Results />
                </MainLayout>
              </PrivateRoute>
            }
          />

          {/* Route 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
