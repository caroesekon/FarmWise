import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import TrialExpiredPage from '../pages/TrialExpiredPage';
import DashboardPage from '../pages/DashboardPage';
import LivestockPage from '../pages/LivestockPage';
import AnimalDetailPage from '../pages/AnimalDetailPage';
import HealthPage from '../pages/HealthPage';
import VaccinationPage from '../pages/VaccinationPage';
import ProductionPage from '../pages/ProductionPage';
import BreedingPage from '../pages/BreedingPage';
import FieldsPage from '../pages/FieldsPage';
import InventoryPage from '../pages/InventoryPage';
import EquipmentPage from '../pages/EquipmentPage';
import FinancePage from '../pages/FinancePage';
import TeamPage from '../pages/TeamPage';
import TasksPage from '../pages/TasksPage';
import WeatherPage from '../pages/WeatherPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import AIChatPage from '../pages/AIChatPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/trial-expired" element={<TrialExpiredPage />} />

      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/livestock" element={<LivestockPage />} />
        <Route path="/livestock/:id" element={<AnimalDetailPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/vaccinations" element={<VaccinationPage />} />
        <Route path="/production" element={<ProductionPage />} />
        <Route path="/breeding" element={<BreedingPage />} />
        <Route path="/fields" element={<FieldsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/finances" element={<RoleRoute roles={['farmAdmin', 'manager']}><FinancePage /></RoleRoute>} />
        <Route path="/team" element={<RoleRoute roles={['farmAdmin', 'manager']}><TeamPage /></RoleRoute>} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/ai" element={<AIChatPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}