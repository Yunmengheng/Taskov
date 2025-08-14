"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MoonIcon, SunIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  // Fix: Use the correct method names from AuthContext
  const { signUp, signIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);

    try {
      // Fix: Use signUp instead of signup
      const { error: signUpError } = await signUp(email, password, name);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        // Check if user needs to verify email first
        setError('Please check your email to verify your account before signing in.');
        // Or redirect to login if email verification is not required
        // router.push('/Login');
      }
    } catch (err) {
      setError(`Failed to create an account: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setSocialLoading('google');

    try {
      // Note: You need to implement these methods in AuthContext if they don't exist
      // For now, commenting out since they're not in the AuthContext we created
      // await loginWithGoogle();
      setError('Google signup not implemented yet');
      // router.push('/Dashboard');
    } catch (err) {
      setError(`Failed to sign up with Google: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFacebookSignup = async () => {
    setError('');
    setSocialLoading('facebook');

    try {
      // Note: You need to implement these methods in AuthContext if they don't exist
      // For now, commenting out since they're not in the AuthContext we created
      // await loginWithFacebook();
      setError('Facebook signup not implemented yet');
      // router.push('/Dashboard');
    } catch (err) {
      setError(`Failed to sign up with Facebook: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className={`${theme} min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/Login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              sign in to your account
            </Link>
          </p>
        </div>
        <div className="absolute top-4 right-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <SunIcon className="h-5 w-5 text-gray-400" /> : <MoonIcon className="h-5 w-5 text-gray-600" />}
          </button>
        </div>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Full name"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Password"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Confirm password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading || socialLoading !== null}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
            >
              {isLoading ? 'Creating account...' : 'Sign up with email'}
            </button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Or sign up with
            </span>
          </div>
        </div>
        {/* Social Signup Buttons - Temporarily disabled */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={true} // Disabled until implemented
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              {/* Google SVG icon here */}
            </span>
            Coming Soon - Google
          </button>
          <button
            type="button"
            onClick={handleFacebookSignup}
            disabled={true} // Disabled until implemented
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              {/* Facebook SVG icon here */}
            </span>
            Coming Soon - Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
