import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import ReportIssue from './pages/ReportIssue';
import SOSScreen from './pages/SOSScreen';
import AuthorityRoute from './components/common/AuthorityRoute';
import AuthorityDashboard from './pages/AuthorityDashboard';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<CitizenDashboard />} />
              <Route path="report" element={<ReportIssue />} />
              <Route path="sos" element={<SOSScreen />} />
            </Route>
          </Route>

          <Route path="/authority" element={<AuthorityRoute />}>
            <Route index element={<AuthorityDashboard />} />
          </Route>

          {/* Fallback Route - Redirects unknown paths to Home/Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
