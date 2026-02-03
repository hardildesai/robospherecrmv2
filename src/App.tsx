import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { MembersPage } from './pages/Members';
import { MemberProfilePage } from './pages/MemberProfile';
import { MemberNewPage } from './pages/MemberNew';
import { EventsPage } from './pages/Events';
import { EventNewPage } from './pages/EventNew';
import { EventAttendancePage } from './pages/EventAttendance';
import { ProjectsPage } from './pages/Projects';
import { ProjectNewPage } from './pages/ProjectNew';
import { ProjectDetailPage } from './pages/ProjectDetail';
import { TeamsPage } from './pages/Teams';
import { InventoryNewPage } from './pages/InventoryNew';
import { InventoryItemDetailPage } from './pages/InventoryItemDetail';
import { InventoryPage } from './pages/Inventory';
import { WaitlistPage } from './pages/Waitlist';
import { RecruitmentPage } from './pages/Recruitment';
import { WikiPage } from './pages/Wiki';
import { UsersPage } from './pages/Users';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { ReleasesPage } from './pages/Releases';
import { ReportsPage } from './pages/Reports';
import { GovernancePage } from './pages/Governance';
import { CalendarPage } from './pages/Calendar';
import { LabConsolePage } from './pages/LabConsole';
import { Toaster } from 'sonner';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

function App() {
    return (
        <Router>
            <Toaster position="top-right" theme="light" />
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/members" element={<MembersPage />} />
                    <Route path="/members/new" element={<MemberNewPage />} />
                    <Route path="/members/:id" element={<MemberProfilePage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/events/new" element={<EventNewPage />} />
                    <Route path="/events/:id/attendance" element={<EventAttendancePage />} />

                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/new" element={<ProjectNewPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailPage />} />

                    <Route path="/teams" element={<TeamsPage />} />

                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/inventory/new" element={<InventoryNewPage />} />
                    <Route path="/inventory/:id" element={<InventoryItemDetailPage />} />
                    <Route path="/waitlist" element={<WaitlistPage />} />
                    <Route path="/recruitment" element={<RecruitmentPage />} />
                    <Route path="/wiki" element={<WikiPage />} />
                    <Route path="/reports" element={<ReportsPage />} />

                    {/* Admin-only routes */}
                    <Route path="/admin" element={<AdminRoute><UsersPage /></AdminRoute>} />
                    <Route path="/admin/audit-logs" element={<AdminRoute requiredRole="superadmin"><AuditLogsPage /></AdminRoute>} />
                    <Route path="/admin/settings" element={<AdminRoute requiredRole="superadmin"><SettingsPage /></AdminRoute>} />
                    <Route path="/releases" element={<AdminRoute><ReleasesPage /></AdminRoute>} />

                    <Route path="/governance" element={<GovernancePage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/lab" element={<LabConsolePage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
