# WorkforceOS - Project Structure

## Complete Folder Structure

```
WorkforceOS/
│
├── frontend/                          # React frontend application
│   ├── public/
│   │   ├── favicon.ico
│   │   └── logo.png
│   │
│   ├── src/
│   │   ├── assets/                   # Static assets (images, fonts)
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   ├── components/               # Shared/reusable components
│   │   │   ├── ui/                   # Base UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Alert.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── Tabs.jsx
│   │   │   │   ├── Dropdown.jsx
│   │   │   │   └── Avatar.jsx
│   │   │   │
│   │   │   ├── forms/                # Form components
│   │   │   │   ├── FormField.jsx
│   │   │   │   ├── TextInput.jsx
│   │   │   │   ├── SelectInput.jsx
│   │   │   │   ├── DatePicker.jsx
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   ├── CheckboxGroup.jsx
│   │   │   │   └── RadioGroup.jsx
│   │   │   │
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Breadcrumb.jsx
│   │   │   │
│   │   │   └── common/               # Common components
│   │   │       ├── Stepper.jsx
│   │   │       ├── StatusPill.jsx
│   │   │       ├── Timeline.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── ErrorBoundary.jsx
│   │   │       ├── ProtectedRoute.jsx
│   │   │       └── LoadingScreen.jsx
│   │   │
│   │   ├── features/                 # Feature modules
│   │   │   │
│   │   │   ├── auth/                 # Authentication
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.jsx
│   │   │   │   │   ├── RegisterForm.jsx
│   │   │   │   │   ├── ForgotPasswordForm.jsx
│   │   │   │   │   └── ResetPasswordForm.jsx
│   │   │   │   ├── pages/
│   │   │   │   │   ├── LoginPage.jsx
│   │   │   │   │   ├── RegisterPage.jsx
│   │   │   │   │   └── ForgotPasswordPage.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useAuth.js
│   │   │   │   │   └── useLogin.js
│   │   │   │   └── services/
│   │   │   │       └── authService.js
│   │   │   │
│   │   │   ├── candidate/            # Candidate portal
│   │   │   │   ├── components/
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   ├── ResumeUploadStep.jsx
│   │   │   │   │   │   ├── PersonalInfoStep.jsx
│   │   │   │   │   │   ├── EducationInfoStep.jsx
│   │   │   │   │   │   ├── AdditionalInfoStep.jsx
│   │   │   │   │   │   ├── ReviewSubmitStep.jsx
│   │   │   │   │   │   ├── ProfileProgressCard.jsx
│   │   │   │   │   │   ├── EducationForm.jsx
│   │   │   │   │   │   ├── EmploymentHistoryForm.jsx
│   │   │   │   │   │   └── BankDetailsForm.jsx
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   ├── StatsWidget.jsx
│   │   │   │   │   │   ├── UpcomingInterviews.jsx
│   │   │   │   │   │   ├── Announcements.jsx
│   │   │   │   │   │   └── RecentApplications.jsx
│   │   │   │   │   ├── applications/
│   │   │   │   │   │   ├── ApplicationCard.jsx
│   │   │   │   │   │   ├── ApplicationFilters.jsx
│   │   │   │   │   │   ├── ApplicationTimeline.jsx
│   │   │   │   │   │   └── ApplicationDetails.jsx
│   │   │   │   │   ├── jobs/
│   │   │   │   │   │   ├── JobCard.jsx
│   │   │   │   │   │   ├── JobList.jsx
│   │   │   │   │   │   ├── JobFilters.jsx
│   │   │   │   │   │   └── JobDetails.jsx
│   │   │   │   │   └── documents/
│   │   │   │   │       ├── DocumentList.jsx
│   │   │   │   │       └── DocumentUpload.jsx
│   │   │   │   │
│   │   │   │   ├── pages/
│   │   │   │   │   ├── CandidateDashboard.jsx
│   │   │   │   │   ├── ProfileWizard.jsx
│   │   │   │   │   ├── MyProfile.jsx
│   │   │   │   │   ├── BrowseJobs.jsx
│   │   │   │   │   ├── JobDetailsPage.jsx
│   │   │   │   │   ├── MyApplications.jsx
│   │   │   │   │   ├── ApplicationDetailsPage.jsx
│   │   │   │   │   ├── MyDocuments.jsx
│   │   │   │   │   ├── Interviews.jsx
│   │   │   │   │   ├── Assessments.jsx
│   │   │   │   │   ├── Messages.jsx
│   │   │   │   │   └── Settings.jsx
│   │   │   │   │
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useCandidateProfile.js
│   │   │   │   │   ├── useApplications.js
│   │   │   │   │   └── useJobs.js
│   │   │   │   │
│   │   │   │   └── services/
│   │   │   │       ├── candidateService.js
│   │   │   │       ├── applicationService.js
│   │   │   │       └── jobService.js
│   │   │   │
│   │   │   ├── employee/             # Employee self-service portal
│   │   │   │   ├── components/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   ├── WelcomeCard.jsx
│   │   │   │   │   │   ├── LeaveBalanceCard.jsx
│   │   │   │   │   │   ├── HolidaysList.jsx
│   │   │   │   │   │   └── RecentDocuments.jsx
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   ├── PersonalInfoTab.jsx
│   │   │   │   │   │   ├── ContactInfoTab.jsx
│   │   │   │   │   │   ├── WorkInfoTab.jsx
│   │   │   │   │   │   ├── EducationTab.jsx
│   │   │   │   │   │   └── DocumentsTab.jsx
│   │   │   │   │   ├── leave/
│   │   │   │   │   │   ├── LeaveRequestForm.jsx
│   │   │   │   │   │   ├── LeaveHistoryTable.jsx
│   │   │   │   │   │   └── LeaveBalanceCard.jsx
│   │   │   │   │   └── policies/
│   │   │   │   │       ├── PolicyCard.jsx
│   │   │   │   │       ├── PolicyViewer.jsx
│   │   │   │   │       └── AcknowledgmentForm.jsx
│   │   │   │   │
│   │   │   │   ├── pages/
│   │   │   │   │   ├── EmployeeDashboard.jsx
│   │   │   │   │   ├── MyProfile.jsx
│   │   │   │   │   ├── MyDocuments.jsx
│   │   │   │   │   ├── LeaveManagement.jsx
│   │   │   │   │   ├── Policies.jsx
│   │   │   │   │   ├── PolicyDetails.jsx
│   │   │   │   │   └── Settings.jsx
│   │   │   │   │
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useEmployeeProfile.js
│   │   │   │   │   ├── useLeave.js
│   │   │   │   │   └── usePolicies.js
│   │   │   │   │
│   │   │   │   └── services/
│   │   │   │       ├── employeeService.js
│   │   │   │       ├── leaveService.js
│   │   │   │       └── policyService.js
│   │   │   │
│   │   │   └── admin/                # Admin/HR portal
│   │   │       ├── components/
│   │   │       │   ├── dashboard/
│   │   │       │   │   ├── StatsCard.jsx
│   │   │       │   │   ├── RecentActivity.jsx
│   │   │       │   │   ├── PendingApprovals.jsx
│   │   │       │   │   └── QuickActions.jsx
│   │   │       │   ├── candidates/
│   │   │       │   │   ├── CandidateTable.jsx
│   │   │       │   │   ├── CandidateFilters.jsx
│   │   │       │   │   ├── CandidateDetails.jsx
│   │   │       │   │   ├── CandidatePipeline.jsx
│   │   │       │   │   ├── StageUpdateModal.jsx
│   │   │       │   │   ├── ConvertToEmployeeModal.jsx
│   │   │       │   │   └── CandidateNotes.jsx
│   │   │       │   ├── employees/
│   │   │       │   │   ├── EmployeeTable.jsx
│   │   │       │   │   ├── EmployeeFilters.jsx
│   │   │       │   │   ├── EmployeeDetails.jsx
│   │   │       │   │   ├── EmployeeForm.jsx
│   │   │       │   │   └── EmployeeDocuments.jsx
│   │   │       │   ├── leave/
│   │   │       │   │   ├── LeaveRequestsTable.jsx
│   │   │       │   │   ├── LeaveApprovalModal.jsx
│   │   │       │   │   ├── LeaveBalanceManager.jsx
│   │   │       │   │   └── HolidayCalendar.jsx
│   │   │       │   ├── policies/
│   │   │       │   │   ├── PolicyTable.jsx
│   │   │       │   │   ├── PolicyForm.jsx
│   │   │       │   │   ├── PolicyAssignment.jsx
│   │   │       │   │   └── AcknowledgmentTracker.jsx
│   │   │       │   ├── jobs/
│   │   │       │   │   ├── JobTable.jsx
│   │   │       │   │   ├── JobForm.jsx
│   │   │       │   │   └── JobApplications.jsx
│   │   │       │   └── settings/
│   │   │       │       ├── OrganizationForm.jsx
│   │   │       │       ├── DepartmentManager.jsx
│   │   │       │       ├── DesignationManager.jsx
│   │   │       │       ├── LocationManager.jsx
│   │   │       │       ├── RoleManager.jsx
│   │   │       │       └── PermissionManager.jsx
│   │   │       │
│   │   │       ├── pages/
│   │   │       │   ├── AdminDashboard.jsx
│   │   │       │   ├── CandidatesPage.jsx
│   │   │       │   ├── CandidateDetailsPage.jsx
│   │   │       │   ├── EmployeesPage.jsx
│   │   │       │   ├── EmployeeDetailsPage.jsx
│   │   │       │   ├── CreateEmployeePage.jsx
│   │   │       │   ├── JobsPage.jsx
│   │   │       │   ├── CreateJobPage.jsx
│   │   │       │   ├── LeaveManagementPage.jsx
│   │   │       │   ├── PoliciesPage.jsx
│   │   │       │   ├── CreatePolicyPage.jsx
│   │   │       │   ├── OrganizationSettings.jsx
│   │   │       │   ├── RolesPermissions.jsx
│   │   │       │   ├── Reports.jsx
│   │   │       │   └── AuditLogs.jsx
│   │   │       │
│   │   │       ├── hooks/
│   │   │       │   ├── useCandidates.js
│   │   │       │   ├── useEmployees.js
│   │   │       │   ├── useLeaveApprovals.js
│   │   │       │   └── usePolicies.js
│   │   │       │
│   │   │       └── services/
│   │   │           ├── candidateAdminService.js
│   │   │           ├── employeeAdminService.js
│   │   │           ├── leaveAdminService.js
│   │   │           └── policyAdminService.js
│   │   │
│   │   ├── layouts/                  # Layout components
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── CandidateLayout.jsx
│   │   │   ├── EmployeeLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── hooks/                    # Global custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── usePermission.js
│   │   │   ├── useNotifications.js
│   │   │   ├── useDebounce.js
│   │   │   └── useToast.js
│   │   │
│   │   ├── services/                 # API services
│   │   │   ├── api.js               # Axios instance config
│   │   │   ├── authService.js
│   │   │   ├── uploadService.js
│   │   │   └── notificationService.js
│   │   │
│   │   ├── stores/                   # Zustand stores
│   │   │   ├── authStore.js
│   │   │   ├── notificationStore.js
│   │   │   └── uiStore.js
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   ├── dateUtils.js
│   │   │   └── helpers.js
│   │   │
│   │   ├── config/                   # Configuration
│   │   │   └── config.js
│   │   │
│   │   ├── App.jsx                   # Root component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── .env.example
│   ├── .env.local
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
│
├── backend/                          # Node.js backend application
│   ├── src/
│   │   ├── config/                   # Configuration
│   │   │   ├── database.js
│   │   │   ├── supabase.js
│   │   │   ├── auth.js
│   │   │   ├── upload.js
│   │   │   └── constants.js
│   │   │
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── permission.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── logger.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   │
│   │   ├── modules/                  # Feature modules
│   │   │   │
│   │   │   ├── core/                 # Platform core
│   │   │   │   ├── organization/
│   │   │   │   │   ├── organization.routes.js
│   │   │   │   │   ├── organization.controller.js
│   │   │   │   │   ├── organization.service.js
│   │   │   │   │   ├── organization.repository.js
│   │   │   │   │   └── organization.validator.js
│   │   │   │   │
│   │   │   │   ├── rbac/
│   │   │   │   │   ├── role.routes.js
│   │   │   │   │   ├── permission.routes.js
│   │   │   │   │   ├── rbac.controller.js
│   │   │   │   │   ├── rbac.service.js
│   │   │   │   │   ├── rbac.repository.js
│   │   │   │   │   └── rbac.validator.js
│   │   │   │   │
│   │   │   │   ├── audit/
│   │   │   │   │   ├── audit.service.js
│   │   │   │   │   ├── audit.repository.js
│   │   │   │   │   └── audit.routes.js
│   │   │   │   │
│   │   │   │   ├── notification/
│   │   │   │   │   ├── notification.routes.js
│   │   │   │   │   ├── notification.controller.js
│   │   │   │   │   ├── notification.service.js
│   │   │   │   │   ├── notification.repository.js
│   │   │   │   │   └── emailTemplates.js
│   │   │   │   │
│   │   │   │   ├── document/
│   │   │   │   │   ├── document.routes.js
│   │   │   │   │   ├── document.controller.js
│   │   │   │   │   ├── document.service.js
│   │   │   │   │   └── document.repository.js
│   │   │   │   │
│   │   │   │   └── workflow/
│   │   │   │       ├── workflow.service.js
│   │   │   │       └── workflow.repository.js
│   │   │   │
│   │   │   ├── auth/                 # Authentication
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.service.js
│   │   │   │   ├── auth.repository.js
│   │   │   │   └── auth.validator.js
│   │   │   │
│   │   │   ├── candidate/            # Candidate management
│   │   │   │   ├── profile/
│   │   │   │   │   ├── profile.routes.js
│   │   │   │   │   ├── profile.controller.js
│   │   │   │   │   ├── profile.service.js
│   │   │   │   │   ├── profile.repository.js
│   │   │   │   │   └── profile.validator.js
│   │   │   │   │
│   │   │   │   ├── application/
│   │   │   │   │   ├── application.routes.js
│   │   │   │   │   ├── application.controller.js
│   │   │   │   │   ├── application.service.js
│   │   │   │   │   ├── application.repository.js
│   │   │   │   │   └── application.validator.js
│   │   │   │   │
│   │   │   │   ├── job/
│   │   │   │   │   ├── job.routes.js
│   │   │   │   │   ├── job.controller.js
│   │   │   │   │   ├── job.service.js
│   │   │   │   │   ├── job.repository.js
│   │   │   │   │   └── job.validator.js
│   │   │   │   │
│   │   │   │   └── admin/
│   │   │   │       ├── candidateAdmin.routes.js
│   │   │   │       ├── candidateAdmin.controller.js
│   │   │   │       ├── candidateAdmin.service.js
│   │   │   │       └── conversion.service.js
│   │   │   │
│   │   │   ├── employee/             # Employee management
│   │   │   │   ├── profile/
│   │   │   │   │   ├── employeeProfile.routes.js
│   │   │   │   │   ├── employeeProfile.controller.js
│   │   │   │   │   ├── employeeProfile.service.js
│   │   │   │   │   └── employeeProfile.repository.js
│   │   │   │   │
│   │   │   │   └── admin/
│   │   │   │       ├── employeeAdmin.routes.js
│   │   │   │       ├── employeeAdmin.controller.js
│   │   │   │       ├── employeeAdmin.service.js
│   │   │   │       └── employeeAdmin.repository.js
│   │   │   │
│   │   │   ├── leave/                # Leave management
│   │   │   │   ├── request/
│   │   │   │   │   ├── leaveRequest.routes.js
│   │   │   │   │   ├── leaveRequest.controller.js
│   │   │   │   │   ├── leaveRequest.service.js
│   │   │   │   │   ├── leaveRequest.repository.js
│   │   │   │   │   └── leaveRequest.validator.js
│   │   │   │   │
│   │   │   │   ├── admin/
│   │   │   │   │   ├── leaveAdmin.routes.js
│   │   │   │   │   ├── leaveAdmin.controller.js
│   │   │   │   │   └── leaveAdmin.service.js
│   │   │   │   │
│   │   │   │   └── master/
│   │   │   │       ├── leaveType.routes.js
│   │   │   │       ├── leaveType.controller.js
│   │   │   │       ├── leaveType.service.js
│   │   │   │       └── holiday.routes.js
│   │   │   │
│   │   │   └── policy/               # Policy management
│   │   │       ├── policy.routes.js
│   │   │       ├── policy.controller.js
│   │   │       ├── policy.service.js
│   │   │       ├── policy.repository.js
│   │   │       └── policy.validator.js
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ├── logger.js
│   │   │   ├── response.js
│   │   │   ├── errors.js
│   │   │   ├── validators.js
│   │   │   ├── dateUtils.js
│   │   │   └── helpers.js
│   │   │
│   │   ├── database/                 # Database related
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── client.js
│   │   │
│   │   ├── app.js                    # Express app setup
│   │   └── server.js                 # Server entry point
│   │
│   ├── .env.example
│   ├── .env.local
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── database/                         # Database scripts and docs
│   ├── schema/
│   │   ├── 001_core_tables.sql
│   │   ├── 002_candidate_tables.sql
│   │   ├── 003_employee_tables.sql
│   │   ├── 004_leave_tables.sql
│   │   └── 005_policy_tables.sql
│   ├── migrations/
│   ├── seeds/
│   └── README.md
│
├── docs/                             # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── SETUP.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── ARCHITECTURE.md
├── PROJECT_STRUCTURE.md
└── README.md
```

## Module Organization Principles

### Frontend Features
Each feature module contains:
- `components/` - Feature-specific components
- `pages/` - Route-level page components
- `hooks/` - Custom hooks for that feature
- `services/` - API service layer for that feature

### Backend Modules
Each module contains:
- `routes.js` - Express route definitions
- `controller.js` - Request/response handling
- `service.js` - Business logic
- `repository.js` - Data access layer
- `validator.js` - Input validation schemas

### Shared Code
- Frontend: `components/`, `hooks/`, `utils/` for shared utilities
- Backend: `middleware/`, `utils/`, `core/` for shared services

