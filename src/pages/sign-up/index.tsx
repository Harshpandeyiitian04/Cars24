import { AlertCircle, Lock, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/AuthProvider';

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmpassword: '',
    fullname: '',
    phone: '',
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

    // Client-side validation
    if (!formData.fullname.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmpassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!formData.phone.match(/^\+?[\d\s-]{10,}$/)) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullname: formData.fullname,
        phone: formData.phone,
      });
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
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
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Create Your Account</h2>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
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
              <label htmlFor="fullname" className="flex items-center text-sm font-medium text-gray-700">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>
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
              <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your phone number"
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
            <div>
              <label htmlFor="confirmpassword" className="flex items-center text-sm font-medium text-gray-700">
                <Lock className="h-4 w-4 mr-2 text-gray-500" />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmpassword"
                id="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Confirm your password"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } transition-all duration-200`}
                aria-label="Create account"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}