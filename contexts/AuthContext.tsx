'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  provider?: 'email' | 'google' | 'facebook' | 'guest';
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const supabase = getSupabase();
        if (!supabase) {
          if (isMounted) setLoading(false);
          return;
        }

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setCurrentUser(session?.user ? mapSupabaseUser(session.user) : null);
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (isMounted) {
            setCurrentUser(session?.user ? mapSupabaseUser(session.user) : null);
          }
        });

        if (isMounted) setLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const mapSupabaseUser = (user: SupabaseUser): User => {
    let provider: 'email' | 'google' | 'facebook' | 'guest' = 'email';
    
    if (user.app_metadata?.provider) {
      const metaProvider = user.app_metadata.provider;
      if (metaProvider === 'google' || metaProvider === 'facebook') {
        provider = metaProvider;
      }
    } else if (user.is_anonymous) {
      provider = 'guest';
    }

    return {
      id: user.id,
      name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      role: (user.user_metadata?.role as 'admin' | 'user' | 'guest') || 'user',
      provider,
    };
  };

  const login = async (email: string, password: string): Promise<void> => {
    console.log('🔍 AuthContext: Starting login process...');
    
    const supabase = getSupabase();
    if (!supabase) {
      console.error('❌ AuthContext: Supabase not initialized');
      throw new Error('Supabase not initialized');
    }

    console.log('🔍 AuthContext: Calling Supabase signInWithPassword...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ AuthContext: Supabase login error:', error);
      throw new Error(error.message);
    }
    
    console.log('✅ AuthContext: Login successful:', data);
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    console.log('🔍 AuthContext: Starting signup process...');
    console.log('🔍 AuthContext: Signup data:', { name, email, password: '***' });
    
    const supabase = getSupabase();
    if (!supabase) {
      console.error('❌ AuthContext: Supabase not initialized');
      throw new Error('Supabase not initialized');
    }

    console.log('🔍 AuthContext: Calling Supabase signUp...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          full_name: name,
        },
      },
    });

    if (error) {
      console.error('❌ AuthContext: Supabase signup error:', error);
      throw new Error(error.message);
    }
    
    console.log('✅ AuthContext: Signup successful:', data);
  };

  const loginWithGoogle = async (): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/Dashboard` : undefined,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const loginWithFacebook = async (): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/Dashboard` : undefined,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const loginAsGuest = async (): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');

    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
      throw new Error(error.message);
    }
  };

  const logout = async (): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');

    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    loginWithFacebook,
    loginAsGuest,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isGuest: currentUser?.role === 'guest',
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

