import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../../services/authService';
import { useAuthStore, getRedirectPath } from '../../../stores/authStore';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import AuthBrandPanel from '../components/AuthBrandPanel';
import SocialAuthButtons from '../components/SocialAuthButtons';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
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
    resolver: zodResolver(loginSchema),
  });

  const finishAuth = (response) => {
    setAuth(response.data);
    navigate(getRedirectPath(response.data.user.userType), { replace: true });
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await authService.login(data.email, data.password);
      if (response.success) {
        finishAuth(response);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed. Please try again.');
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
          `Unable to start ${provider} login. Enable the provider in Supabase Auth settings.`
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Login to your account to continue your journey</p>
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
              <span className="px-4 bg-white text-gray-500">OR CONTINUE WITH</span>
            </div>
          </div>

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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <Input
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

            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-700">Keep me signed in</span>
            </label>

            <Button type="submit" variant="primary" fullWidth size="lg" loading={isLoading} disabled={isLoading || oauthLoading}>
              Login to Career Portal
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account yet?{' '}
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
