import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { useAuthStore, getRedirectPath } from '../../../stores/authStore';
import { getSupabaseBrowserClient } from '../../../lib/supabaseClient';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const completeOAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          throw new Error('Supabase is not configured in the frontend environment.');
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        let accessToken = data.session?.access_token;

        if (!accessToken) {
          const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );
          if (exchangeError) throw exchangeError;
          accessToken = exchangeData.session?.access_token;
        }

        if (!accessToken) {
          throw new Error('No social login session found. Please try again.');
        }

        const response = await authService.completeSupabaseOAuth(accessToken);
        if (cancelled) return;

        setAuth(response.data);
        navigate(getRedirectPath(response.data.user.userType), { replace: true });
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.data?.error?.message || err.message || 'Social login failed');
      }
    };

    completeOAuth();

    return () => {
      cancelled = true;
    };
  }, [navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Social login failed</h1>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="px-4 py-2 rounded-lg bg-navy-800 text-white"
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Completing sign in...</h1>
            <p className="text-sm text-gray-600">Please wait while we finish connecting your account.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
