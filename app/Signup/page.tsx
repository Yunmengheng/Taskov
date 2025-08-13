"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MoonIcon, SunIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getSupabase = () => {
  return supabase
}

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const {
    signup,
    loginWithGoogle,
    loginWithFacebook
  } = useAuth();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setIsLoading(true);
    
    // Debug logging
    console.log('🔍 Attempting signup with:', { 
      name, 
      email, 
      password: password ? '***' : 'empty',
      confirmPassword: confirmPassword ? '***' : 'empty'
    });
    console.log('🔍 Auth context available:', !!signup);
    
    try {
      await signup(name, email, password);
      console.log('✅ Signup successful, redirecting to Dashboard...');
      router.push('/Dashboard'); // Changed from '/dashboard' to '/Dashboard'
    } catch (err) {
      console.error('❌ Signup error:', err);
      setError(`Failed to create an account: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignup = async () => {
    setError('');
    setSocialLoading('google');
    
    console.log('🔍 Attempting Google signup...');
    
    try {
      await loginWithGoogle();
      console.log('✅ Google signup successful, redirecting...');
      router.push('/Dashboard'); // Changed from '/dashboard' to '/Dashboard'
    } catch (err) {
      console.error('❌ Google signup error:', err);
      setError(`Failed to sign up with Google: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSocialLoading(null);
    }
  };
  const handleFacebookSignup = async () => {
    setError('');
    setSocialLoading('facebook');
    
    console.log('🔍 Attempting Facebook signup...');
    
    try {
      await loginWithFacebook();
      console.log('✅ Facebook signup successful, redirecting...');
      router.push('/Dashboard'); // Changed from '/dashboard' to '/Dashboard'
    } catch (err) {
      console.error('❌ Facebook signup error:', err);
      setError(`Failed to sign up with Facebook: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSocialLoading(null);
    }
  };
  return <div className={`${theme} min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8`}>
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

        {/* Social Signup Buttons */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input id="name" name="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10" placeholder="Full name" />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10" placeholder="Email address" />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10" placeholder="Password" />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="appearance-none rounded-b-md relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10" placeholder="Confirm password" />
            </div>
          </div>
          <div>
            <button type="submit" disabled={isLoading || socialLoading !== null} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70">
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
              Or sign up with email
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button type="button" onClick={handleGoogleSignup} disabled={isLoading || socialLoading !== null} className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70">
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
            </span>
            {socialLoading === 'google' ? 'Signing up...' : 'Sign up with Google'}
          </button>
          <button type="button" onClick={handleFacebookSignup} disabled={isLoading || socialLoading !== null} className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70">
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
            </span>
            {socialLoading === 'facebook' ? 'Signing up...' : 'Sign up with Facebook'}
          </button>
        </div>
        
      </div>
    </div>;
};
export default Signup;