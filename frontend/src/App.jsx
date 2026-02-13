import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleAuthProvider } from './contexts/GoogleAuthContext';
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importação das páginas
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import DevicePage from "./pages/DevicePage";
import ProductsPage from "./pages/ProductsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ForgotPassword from './pages/auth/ForgotPassword';
import WorkstationPage from './pages/WorkstationPage';
import ProductionOrderPage from './pages/ProductionOrderPage';
import ProductionPlanPage from './pages/ProductionPlanPage';
import TemplatePage from './pages/TemplatePage';
import ResetPassword from './pages/auth/ResetPassword';

// ID do cliente Google OAuth da variável de ambiente
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <>
      {/* Toastify container global */}
      <ToastContainer
        position="top-center"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      <Router>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <GoogleAuthProvider>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<LoginPage />} /> {/* Primeira page que o usuário vê */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Rotas privadas */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <PrivateRoute>
                      <UsersPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dispositivos"
                  element={
                    <PrivateRoute>
                      <DevicePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/produtos"
                  element={
                    <PrivateRoute>
                      <ProductsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/meu-perfil"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/linha-de-producao"
                  element={
                    <PrivateRoute>
                      <WorkstationPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/configuracoes"
                  element={
                    <PrivateRoute>
                      <SettingsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/ordem-de-producao"
                  element={
                    <PrivateRoute>
                      <ProductionOrderPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/plano-de-producao"
                  element={
                    <PrivateRoute>
                      <ProductionPlanPage />
                    </PrivateRoute>
                  }
                />
                {/* Rota para teste do designer */}
                <Route
                  path="/teste"
                  element={
                    <PrivateRoute>
                      <TemplatePage />
                    </PrivateRoute>
                  }
                />
                {/* Rota para redirecionar qualquer caminho não encontrado */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </GoogleAuthProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </Router>
    </>
  );
}

export default App;
