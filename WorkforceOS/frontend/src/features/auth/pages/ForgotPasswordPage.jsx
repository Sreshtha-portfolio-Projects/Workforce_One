import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { authService } from '../../../services/authService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import AuthBrandPanel from '../components/AuthBrandPanel';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess(null);

      const response = await authService.forgotPassword(data.email);
      setSuccess(response.data || {});
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Unable to process request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <AuthBrandPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot password?</h2>
            <p className="text-gray-600">
              Enter your email and we&apos;ll generate a password reset link for your account.
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  If an account exists for that email, password reset instructions were generated.
                </p>
              </div>

              {success.resetUrl && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-blue-900">Development reset link</p>
                  <p className="text-xs text-blue-800 break-all">{success.resetUrl}</p>
                  <Link
                    to={`/reset-password?token=${success.resetToken}`}
                    className="inline-flex text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Continue to reset password →
                  </Link>
                </div>
              )}

              <Link to="/login">
                <Button variant="outline" fullWidth>
                  Return to login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" variant="primary" fullWidth size="lg" loading={isLoading} disabled={isLoading}>
                Send reset link
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
