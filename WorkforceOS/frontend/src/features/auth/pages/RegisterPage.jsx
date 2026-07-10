import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { authService } from '../../../services/authService';
import { useAuthStore, getRedirectPath } from '../../../stores/authStore';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import AuthBrandPanel from '../components/AuthBrandPanel';
import SocialAuthButtons from '../components/SocialAuthButtons';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .min(10, 'Enter a valid phone number')
      .regex(/^[+]?[\d\s()-]{10,20}$/, 'Enter a valid phone number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[a-z]/, 'Include at least one lowercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms to continue',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const finishAuth = (response) => {
    setAuth(response.data);
    navigate(getRedirectPath(response.data.user.userType), { replace: true });
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await authService.register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone.replace(/\s/g, ''),
        password: data.password,
      });

      if (response.success) {
        finishAuth(response);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setOauthLoading(provider);
      setError('');
      await authService.loginWithOAuthProvider(provider);
    } catch (err) {
      setError(
        err.message ||
          `Unable to start ${provider} signup. Enable the provider in Supabase Auth settings.`
      );
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex">
      <AuthBrandPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">Sign up to apply for jobs and track your applications</p>
          </div>

          <SocialAuthButtons
            loadingProvider={oauthLoading}
            disabled={isLoading}
            onGoogle={() => handleSocialLogin('google')}
            onLinkedIn={() => handleSocialLogin('linkedin_oidc')}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR SIGN UP WITH EMAIL</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              label="Full Name"
              placeholder="John Doe"
              icon={User}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 9876543210"
              icon={Phone}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
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

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  {...register('acceptTerms')}
                />
                <span className="text-sm text-gray-700">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600 mt-1">{errors.acceptTerms.message}</p>
              )}
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" loading={isLoading} disabled={isLoading || oauthLoading}>
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
