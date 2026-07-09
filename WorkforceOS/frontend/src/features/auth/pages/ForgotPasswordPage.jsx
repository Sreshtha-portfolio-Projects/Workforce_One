import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="text-gray-600 mb-4">Enter your email to reset your password</p>
        <Link to="/login" className="text-primary-600 hover:underline">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
