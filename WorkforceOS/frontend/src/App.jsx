import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import CandidateLayout from './layouts/CandidateLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';

// Candidate Pages
import CandidateDashboard from './features/candidate/pages/CandidateDashboard';
import ProfileWizard from './features/candidate/pages/ProfileWizard';
import BrowseJobs from './features/candidate/pages/BrowseJobs';
import JobDetailsPage from './features/candidate/pages/JobDetailsPage';
import MyApplications from './features/candidate/pages/MyApplications';
import ApplicationDetailsPage from './features/candidate/pages/ApplicationDetailsPage';
import MyProfile from './features/candidate/pages/MyProfile';
import MyDocuments from './features/candidate/pages/MyDocuments';

// Employee Pages  
import EmployeeDashboard from './features/employee/pages/EmployeeDashboard';
import EmployeeProfile from './features/employee/pages/EmployeeProfile';
import LeaveManagement from './features/employee/pages/LeaveManagement';
import EmployeeDocuments from './features/employee/pages/EmployeeDocuments';
import Policies from './features/employee/pages/Policies';

// Admin Pages
import AdminDashboard from './features/admin/pages/AdminDashboard';
import CandidatesPage from './features/admin/pages/CandidatesPage';
import EmployeesPage from './features/admin/pages/EmployeesPage';
import JobsPage from './features/admin/pages/JobsPage';
import LeaveManagementPage from './features/admin/pages/LeaveManagementPage';
import PoliciesPage from './features/admin/pages/PoliciesPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedTypes }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(user?.userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Candidate Routes */}
      <Route 
        path="/candidate" 
        element={
          <ProtectedRoute allowedTypes={['candidate']}>
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CandidateDashboard />} />
        <Route path="profile/wizard" element={<ProfileWizard />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="jobs" element={<BrowseJobs />} />
        <Route path="jobs/:jobId" element={<JobDetailsPage />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="applications/:applicationId" element={<ApplicationDetailsPage />} />
        <Route path="documents" element={<MyDocuments />} />
      </Route>

      {/* Employee Routes */}
      <Route 
        path="/employee" 
        element={
          <ProtectedRoute allowedTypes={['employee']}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="leave" element={<LeaveManagement />} />
        <Route path="documents" element={<EmployeeDocuments />} />
        <Route path="policies" element={<Policies />} />
      </Route>

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedTypes={['admin', 'hr', 'recruiter']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="candidates" element={<CandidatesPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="leave" element={<LeaveManagementPage />} />
        <Route path="policies" element={<PoliciesPage />} />
      </Route>

      {/* Root Redirect */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            user?.userType === 'candidate' ? <Navigate to="/candidate" /> :
            user?.userType === 'employee' ? <Navigate to="/employee" /> :
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/login" />
          )
        } 
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
