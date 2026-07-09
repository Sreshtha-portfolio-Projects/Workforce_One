import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../../services/authService';
import { useAuthStore } from '../../../stores/authStore';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await authService.login(data.email, data.password);
      
      if (response.success) {
        setAuth(response.data);
        
        // Redirect based on user type
        const userType = response.data.user.userType;
        if (userType === 'candidate') {
          navigate('/candidate');
        } else if (userType === 'employee') {
          navigate('/employee');
        } else {
          navigate('/admin');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Blue Gradient with Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Logo */}
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold">WorkforceOS</span>
          </div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Your future<br />
              starts <span className="text-yellow-400">here</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-md mx-auto">
              Explore opportunities, grow your skills, and build a career with us.
            </p>
          </div>

          {/* Illustration - Simplified version */}
          <div className="relative w-full max-w-md h-64 flex items-center justify-center">
            <div className="flex gap-8 items-end">
              {/* Three character placeholders */}
              <div className="w-24 h-32 bg-blue-700 rounded-t-full opacity-80"></div>
              <div className="w-24 h-36 bg-blue-600 rounded-t-full opacity-90"></div>
              <div className="w-24 h-32 bg-blue-700 rounded-t-full opacity-80"></div>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Join thousands of students building their future with great companies</span>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4">
            <div className="px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full text-sm">
              Latest Job Openings
            </div>
            <div className="px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full text-sm">
              Internship for students
            </div>
            <div className="px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full text-sm">
              Track your application
            </div>
            <div className="px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full text-sm">
              Career Resource
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Login to your account to continue your journey</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">Continue with Google</span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="font-medium">Continue with Linkedin</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@synergyworkforce.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-700">Keep me signed in</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              Login to Career Portal
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
