import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout.jsx';
import { ProtectedRoute } from '../components/guards/ProtectedRoute.jsx';
import { RoleGuard } from '../components/guards/RoleGuard.jsx';
import { Role } from '../../core/domain/enums/Role.js';
import { LoginPage } from '../pages/LoginPage.jsx';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { CustomersListPage } from '../pages/CustomersListPage.jsx';
import { CustomerFormPage } from '../pages/CustomerFormPage.jsx';
import { CustomerDetailPage } from '../pages/CustomerDetailPage.jsx';
import { LeadsListPage } from '../pages/LeadsListPage.jsx';
import { LeadFormPage } from '../pages/LeadFormPage.jsx';
import { LeadDetailPage } from '../pages/LeadDetailPage.jsx';
import { DealsListPage } from '../pages/DealsListPage.jsx';
import { DealFormPage } from '../pages/DealFormPage.jsx';
import { TasksPage } from '../pages/TasksPage.jsx';
import { UsersListPage } from '../pages/UsersListPage.jsx';
import { UserFormPage } from '../pages/UserFormPage.jsx';
import { ProfilePage } from '../pages/ProfilePage.jsx';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersListPage />} />
        <Route path="/customers/new" element={<CustomerFormPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
        <Route path="/leads" element={<LeadsListPage />} />
        <Route path="/leads/new" element={<LeadFormPage />} />
        <Route path="/leads/:id" element={<LeadDetailPage />} />
        <Route path="/leads/:id/edit" element={<LeadFormPage />} />
        <Route path="/deals" element={<DealsListPage />} />
        <Route path="/deals/new" element={<DealFormPage />} />
        <Route path="/deals/:id/edit" element={<DealFormPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route
          path="/users"
          element={
            <RoleGuard roles={[Role.ADMIN]}>
              <UsersListPage />
            </RoleGuard>
          }
        />
        <Route
          path="/users/new"
          element={
            <RoleGuard roles={[Role.ADMIN]}>
              <UserFormPage />
            </RoleGuard>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <RoleGuard roles={[Role.ADMIN]}>
              <UserFormPage />
            </RoleGuard>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}