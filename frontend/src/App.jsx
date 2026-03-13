import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/NotFoundPage';

function AppContent() {
  const { isAuthenticated, role } = useAuth();
  const defaultRoute = isAuthenticated
    ? role === 'ADMIN'
      ? '/admin/dashboard'
      : '/user/dashboard'
    : '/login';

  return (
    <>
      {isAuthenticated && <NavBar />}
      <main 
        style={{ marginLeft: isAuthenticated ? '260px' : '0' }} 
        className="min-h-screen transition-all duration-300 ease-in-out bg-bg relative"
      >
        <div className="max-w-[1400px] mx-auto px-6 py-10 md:px-10 md:py-16">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/projects" element={<ProjectsPage />} />
              <Route path="/admin/tasks" element={<TasksPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="USER" />}>
              <Route path="/user/dashboard" element={<DashboardPage />} />
              <Route path="/user/projects" element={<ProjectsPage />} />
              <Route path="/user/tasks" element={<TasksPage />} />
            </Route>

            <Route path="/dashboard" element={<Navigate to={defaultRoute} replace />} />
            <Route path="/tasks" element={<Navigate to={isAuthenticated ? (role === 'ADMIN' ? '/admin/tasks' : '/user/tasks') : '/login'} replace />} />
            <Route path="/projects" element={<Navigate to="/admin/projects" replace />} />
            <Route path="/users" element={<Navigate to="/admin/users" replace />} />
            <Route path="/" element={<Navigate to={defaultRoute} replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
