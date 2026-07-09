# WorkforceOS Frontend

Production-ready React frontend application for the WorkforceOS Enterprise Workforce Management Platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (see ../backend/README.md)

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Edit .env.local with your configuration:
# - VITE_API_URL (backend API URL)
# - VITE_SUPABASE_URL (Supabase project URL)
# - VITE_SUPABASE_ANON_KEY (Supabase anon key)

# Start development server
npm run dev

# App will open at http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/           # Shared/reusable components
│   ├── ui/              # Base UI components (Button, Input, Card, etc.)
│   └── common/          # Common components (PlaceholderPage, etc.)
├── features/            # Feature modules
│   ├── auth/           # Authentication (Login, Register)
│   ├── candidate/      # Candidate portal pages
│   ├── employee/       # Employee portal pages
│   └── admin/          # Admin portal pages
├── layouts/            # Layout components
│   ├── PublicLayout    # For public pages (login/register)
│   ├── CandidateLayout # For candidate portal
│   ├── EmployeeLayout  # For employee portal
│   └── AdminLayout     # For admin portal
├── services/           # API service layer
│   ├── api.js         # Axios instance with interceptors
│   ├── authService.js # Auth API calls
│   └── candidateService.js # Candidate API calls
├── stores/             # Zustand state stores
│   └── authStore.js   # Authentication state
├── config/             # Configuration
│   └── config.js      # App configuration
├── App.jsx            # Main app with routing
└── main.jsx          # Entry point
```

---

## ✅ What's Implemented

### Infrastructure (100%)
- ✅ Vite + React setup
- ✅ Tailwind CSS with custom theme
- ✅ React Router v6 with protected routes
- ✅ Axios API client with interceptors
- ✅ React Query for server state
- ✅ Zustand for client state
- ✅ React Hook Form + Zod validation

### UI Components Library
- ✅ Button component with variants
- ✅ Input component with labels & errors
- ✅ Card component with sections
- ✅ Stepper component for wizard
- ⏳ Modal, Badge, Select, Table (to be built)

### Layouts
- ✅ PublicLayout (for login/register)
- ✅ CandidateLayout (with sidebar & header)
- ⏳ EmployeeLayout (placeholder - needs implementation)
- ⏳ AdminLayout (placeholder - needs implementation)

### Authentication Pages
- ✅ **LoginPage** - Complete with social login, form validation
- ⏳ RegisterPage (placeholder)
- ⏳ ForgotPasswordPage (placeholder)

### Candidate Portal Pages
- ⏳ CandidateDashboard (placeholder)
- ⏳ ProfileWizard - 5-step profile completion (placeholder)
- ⏳ BrowseJobs (placeholder)
- ⏳ MyApplications (placeholder)
- ⏳ MyProfile (placeholder)
- ⏳ MyDocuments (placeholder)

### Employee Portal Pages
- ⏳ All pages are placeholders

### Admin Portal Pages
- ⏳ All pages are placeholders

---

## 🎨 Design Implementation

The frontend is being built to match the exact UI designs provided:

1. **Login Page** ✅
   - Blue gradient left side with illustration
   - White form area on right
   - Social login buttons
   - Clean, modern design

2. **Profile Wizard** (To build)
   - 5-step stepper
   - Step 1: Upload Resume
   - Step 2: Personal Information
   - Step 3: Education & Skills
   - Step 4: Additional Info (Bank, Employment)
   - Step 5: Review & Submit

3. **Candidate Dashboard** (To build)
   - Stats widgets
   - Upcoming interviews
   - Announcements
   - Recent applications

4. **Admin Dashboard** (To build)
   - Workforce overview chart
   - Recruitment pipeline
   - Finance overview
   - Quick actions

---

## 🔌 API Integration

All API calls go through the service layer:

```javascript
// Example: Auth
import { authService } from './services/authService';
const response = await authService.login(email, password);

// Example: Candidate
import { candidateService } from './services/candidateService';
const profile = await candidateService.getProfile();
```

The `api.js` client handles:
- Automatic token injection
- Token refresh on 401
- Error handling
- Request/response interceptors

---

## 🗺️ Routing

The app uses React Router v6 with protected routes:

```
/ → Redirects based on auth status and user type

Public Routes:
├── /login
├── /register
└── /forgot-password

Candidate Routes (protected):
├── /candidate (dashboard)
├── /candidate/profile/wizard
├── /candidate/profile
├── /candidate/jobs
├── /candidate/applications
└── /candidate/documents

Employee Routes (protected):
├── /employee (dashboard)
├── /employee/profile
├── /employee/leave
├── /employee/documents
└── /employee/policies

Admin Routes (protected):
├── /admin (dashboard)
├── /admin/candidates
├── /admin/employees
├── /admin/jobs
├── /admin/leave
└── /admin/policies
```

---

## 🎯 Next Steps to Complete Frontend

### 1. Complete UI Component Library (4-6 hours)
Create remaining components:
- `Modal.jsx` - Modal/dialog component
- `Badge.jsx` - Status badges
- `Select.jsx` - Dropdown select
- `Textarea.jsx` - Text area input
- `FileUpload.jsx` - File upload with drag & drop
- `Table.jsx` - Data table component
- `Pagination.jsx` - Pagination component
- `LoadingSpinner.jsx` - Loading states
- `Alert.jsx` - Alert/toast messages
- `Tabs.jsx` - Tab navigation

### 2. Complete Candidate Portal (12-15 hours)

**Profile Wizard** (High Priority):
Create 5 step components following the exact designs:
- `features/candidate/components/profile/UploadResumeStep.jsx`
- `features/candidate/components/profile/PersonalInfoStep.jsx`
- `features/candidate/components/profile/EducationStep.jsx`
- `features/candidate/components/profile/AdditionalInfoStep.jsx`
- `features/candidate/components/profile/ReviewSubmitStep.jsx`

Update `ProfileWizard.jsx` to use these steps with the Stepper component.

**Other Pages**:
- Implement `CandidateDashboard.jsx` with widgets
- Build `BrowseJobs.jsx` with job cards and filters
- Create `MyApplications.jsx` with status tabs
- Build `MyProfile.jsx` for viewing profile

### 3. Build Employee Portal (8-10 hours)
- Complete `EmployeeLayout.jsx` following CandidateLayout pattern
- Implement all employee pages
- Add leave request forms
- Policy acknowledgment flow

### 4. Build Admin Portal (12-15 hours)
- Complete `AdminLayout.jsx` with comprehensive navigation
- Build admin dashboard with charts (consider recharts library)
- Implement candidate management with tables and filters
- Create employee management pages
- Build leave approval workflow pages

### 5. Testing & Polish (5-8 hours)
- Test all user flows end-to-end
- Responsive design testing
- Error handling improvements
- Loading states
- Empty states
- Success/error toast messages

---

## 🛠️ Development Guidelines

### Adding a New Page

1. Create page component in appropriate feature folder
2. Import in `App.jsx` and add to routes
3. Use existing components from `components/ui/`
4. Follow the established patterns

### Component Pattern

```jsx
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const MyPage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <Card.Header>
          <Card.Title>Page Title</Card.Title>
          <Card.Description>Description text</Card.Description>
        </Card.Header>
        <Card.Content>
          {/* Your content */}
        </Card.Content>
      </Card>
    </div>
  );
};

export default MyPage;
```

### API Integration Pattern

```jsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { candidateService } from '@/services/candidateService';

const MyComponent = () => {
  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: candidateService.getProfile
  });

  // Mutate data
  const mutation = useMutation({
    mutationFn: candidateService.updatePersonalInfo,
    onSuccess: () => {
      // Handle success
    }
  });

  return (/* JSX */);
};
```

---

## 🎨 Styling Guidelines

Use Tailwind CSS utility classes:

```jsx
// Good ✅
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">

// Avoid ❌
<div style={{ display: 'flex', padding: '1.5rem' }}>
```

Custom colors available:
- `primary-*` (blue shades)
- `navy-*` (dark blue for headers)
- Standard Tailwind colors

---

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `vite` - Build tool

### State & Data
- `zustand` - Client state management
- `@tanstack/react-query` - Server state management
- `axios` - HTTP client

### Forms
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@hookform/resolvers` - Form + Zod integration

### UI
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `clsx` - className utility
- `date-fns` - Date formatting

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_API_URL=your_production_api_url
```

---

## 📝 Environment Variables

Required variables in `.env.local`:

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🆘 Troubleshooting

### App won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### API calls failing
- Check backend is running on port 5000
- Verify VITE_API_URL in .env.local
- Check browser console for CORS errors

### Build errors
```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm run build
```

---

## 📚 Resources

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)

---

## ✨ Current Status

**Foundation**: Complete ✅
**Login Page**: Complete ✅
**Routing**: Complete ✅
**API Layer**: Complete ✅
**Remaining Pages**: ~40 hours of development

**You can start building pages right now!**

Follow the `LoginPage.jsx` example for quality and patterns.

---

**Created**: 2026-07-09  
**Status**: Foundation Complete, Ready for Page Development  
**Next**: Build Profile Wizard (highest priority)

