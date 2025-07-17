import { AlertCircle, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/AuthProvider';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth(); // Changed from `login` to match the context
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password); // Uses `login` from context
      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <main className="max-w-md mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <Link href="/" className="text-blue-600 font-bold text-xl hover:underline">
              Auto Market
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Login Your Account</h2>
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
          {error && (
            <div className="bg-red-50 p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700">
                <Lock className="h-4 w-4 mr-2 text-gray-500" />
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember Me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot Your Password
                </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } transition-all duration-200`}
                aria-label="Login account"
              >
                {loading ? 'Logging in Account...' : 'Login Account'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
