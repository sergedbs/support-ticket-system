import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminPage from './pages/AdminPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HomePage from './pages/HomePage.jsx';
import TicketDetailPage from './pages/TicketDetailPage.jsx';
import TicketFormPage from './pages/TicketFormPage.jsx';
import TicketsPage from './pages/TicketsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['User', 'Agent', 'Admin']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="tickets"
          element={
            <ProtectedRoute allowedRoles={['User', 'Agent', 'Admin']}>
              <TicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="tickets/new"
          element={
            <ProtectedRoute allowedRoles={['User', 'Admin']}>
              <TicketFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="tickets/:id"
          element={
            <ProtectedRoute allowedRoles={['User', 'Agent', 'Admin']}>
              <TicketDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="tickets/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['User', 'Agent', 'Admin']}>
              <TicketFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
